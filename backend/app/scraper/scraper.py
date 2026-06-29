import hashlib
import re
import httpx
from bs4 import BeautifulSoup
from datetime import datetime, timezone
from app.database import supabase


SCRAPE_URL = "https://www.aixploria.com/en/free-ai/"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    text = re.sub(r"^-+|-+$", "", text)
    return text


def make_hash(*parts: str) -> str:
    combined = "|".join(p or "" for p in parts)
    return hashlib.md5(combined.encode()).hexdigest()


def detect_pricing(text: str) -> str:
    text_lower = (text or "").lower()
    if "freemium" in text_lower:
        return "Freemium"
    if "free" in text_lower:
        return "Free"
    if "paid" in text_lower or "premium" in text_lower or "$" in text_lower:
        return "Paid"
    if "trial" in text_lower:
        return "Trial"
    return "Unknown"


def get_or_create_category(name: str) -> str:
    """Return category id, creating it if needed."""
    slug = slugify(name)
    existing = supabase.table("categories").select("id").eq("slug", slug).execute()
    if existing.data:
        return existing.data[0]["id"]
    result = supabase.table("categories").insert({"name": name, "slug": slug}).execute()
    return result.data[0]["id"]


def upsert_tool(tool_data: dict, category_names: list[str]) -> bool:
    """Insert or update a tool. Returns True if a new tool was inserted."""
    canonical_url = tool_data["canonical_url"]
    content_hash = tool_data["content_hash"]

    existing = (
        supabase.table("tools")
        .select("id, content_hash")
        .eq("canonical_url", canonical_url)
        .execute()
    )

    now = datetime.now(timezone.utc).isoformat()

    if existing.data:
        tool_id = existing.data[0]["id"]
        old_hash = existing.data[0]["content_hash"]

        if old_hash != content_hash:
            # Content changed — update
            supabase.table("tools").update(
                {
                    "name": tool_data["name"],
                    "description": tool_data["description"],
                    "logo_url": tool_data["logo_url"],
                    "pricing_model": tool_data["pricing_model"],
                    "content_hash": content_hash,
                    "last_seen_at": now,
                    "updated_at": now,
                }
            ).eq("id", tool_id).execute()
        else:
            # No change — just bump last_seen_at
            supabase.table("tools").update({"last_seen_at": now}).eq("id", tool_id).execute()

        _sync_categories(tool_id, category_names)
        return False  # not new
    else:
        # New tool
        insert_data = {**tool_data, "last_seen_at": now}
        result = supabase.table("tools").insert(insert_data).execute()
        tool_id = result.data[0]["id"]
        _sync_categories(tool_id, category_names)
        return True  # new tool


def _sync_categories(tool_id: str, category_names: list[str]) -> None:
    if not category_names:
        return
    # Remove old links then re-insert
    supabase.table("tool_categories").delete().eq("tool_id", tool_id).execute()
    for cat_name in category_names:
        cat_id = get_or_create_category(cat_name)
        supabase.table("tool_categories").upsert(
            {"tool_id": tool_id, "category_id": cat_id}
        ).execute()





def scrape(run_id: str) -> int:
    """Main scrape function. Returns count of tools scraped."""
    tools_scraped = 0

    try:
        with httpx.Client(
            headers=HEADERS,
            timeout=30,
            follow_redirects=True,
        ) as client:
            response = client.get(SCRAPE_URL)
            response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        print("=" * 60)
        print("Downloaded HTML length:", len(response.text))
        print("Page title:", soup.title.string if soup.title else "No title")

        selectors = [
            "article.elementor-post",
            "div.e-loop-item",
            "article",
            ".post-item",
            ".tool-item",
            ".post",
        ]

        for selector in selectors:
            print(f"{selector}: {len(soup.select(selector))}")

        cards = (
            soup.select(".post-item")
            or soup.select("article.elementor-post")
            or soup.select("div.e-loop-item")
            or soup.select("article")
        )

        print("Cards found:", len(cards))
        
        if cards:
         print(cards[0].prettify()[:4000])

        # for card in cards[:60]:
        #     try:
        #         tool_data, categories = _parse_card(card)
        #         if tool_data:
        #             upsert_tool(tool_data, categories)
        #             tools_scraped += 1
        #     except Exception as e:
        #         print("Card skipped:", e)
        for card in cards[:60]:
            try:
                tool_data, categories = _parse_card(card)

                print("TOOL:", tool_data)

                if tool_data:
                 upsert_tool(tool_data, categories)
                 tools_scraped += 1

            except Exception as e:
             print("Card skipped:", e)

        # supabase.table("scrape_runs").update(
        #     {
        #         "status": "completed",
        #         "completed_at": datetime.now(timezone.utc).isoformat(),
        #         "tools_scraped": tools_scraped,
        #     }
        # ).eq("id", run_id).execute()
        print("=" * 60)
        print("Finished processing all tools")
        print(f"Tools scraped: {tools_scraped}")
        print("Updating scrape_runs to completed...")

        result = (
            supabase.table("scrape_runs")
            .update(
                {
                    "status": "completed",
                    "completed_at": datetime.now(timezone.utc).isoformat(),
                    "tools_scraped": tools_scraped,
                }
            )
            .eq("id", run_id)
            .execute()
        )

        print("Update result:", result)
        print("Scrape completed successfully")
        print("=" * 60)

    except Exception as exc:
        print("SCRAPER ERROR:", exc)

        supabase.table("scrape_runs").update(
            {
                "status": "failed",
                "completed_at": datetime.now(timezone.utc).isoformat(),
                "error_message": str(exc),
            }
        ).eq("id", run_id).execute()

        raise

    return tools_scraped


def _parse_card(card) -> tuple[dict | None, list[str]]:
    """Parse a single AIxploria card."""

    # ---------------- Name ----------------
    name_el = (
        card.select_one("span.post-title a")
        or card.select_one(".post-title a")
        or card.select_one("a.dark-title")
    )

    if not name_el:
        return None, []

    name = name_el.get_text(strip=True)

    # ---------------- AIxploria page ----------------
    aixploria_url = name_el.get("href", "").strip()

    # ---------------- Official website ----------------
    official_el = card.select_one("a.dark-title.darkyday")
    official_url = (
        official_el.get("href", "").strip()
        if official_el
        else aixploria_url
    )

    # ---------------- Description ----------------
    desc_el = card.select_one("p.post-excerpt")
    description = desc_el.get_text(strip=True).strip("«» ") if desc_el else ""

    # ---------------- Logo ----------------
    logo_el = card.select_one("img.site-icon")
    logo_url = logo_el.get("src", "") if logo_el else ""

    # ---------------- Categories ----------------
    categories = [
        c.get_text(strip=True)
        for c in card.select("span.post-category a")
    ]

    # ---------------- Pricing ----------------
    pricing_text = card.get_text(" ", strip=True)
    pricing_model = detect_pricing(pricing_text)

    # ---------------- Hash ----------------
    slug = slugify(name)
    content_hash = make_hash(name, description, logo_url, pricing_model)

    tool_data = {
        "name": name,
        "slug": slug,
        "description": description or None,
        "url": official_url,
        "canonical_url": official_url,
        "logo_url": logo_url or None,
        "pricing_model": pricing_model,
        "content_hash": content_hash,
    }

    return tool_data, categories