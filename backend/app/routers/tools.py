from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.database import supabase
from app.schemas import ToolOut, ToolListResponse

router = APIRouter(prefix="/api/tools", tags=["tools"])


def _attach_meta(tools: list[dict]) -> list[dict]:
    """Attach is_favorite flag and categories list to each tool."""
    if not tools:
        return []

    tool_ids = [t["id"] for t in tools]

    # Favorites
    fav_result = (
        supabase.table("favorites").select("tool_id").in_("tool_id", tool_ids).execute()
    )
    fav_ids = {r["tool_id"] for r in (fav_result.data or [])}

    # Categories via tool_categories join
    tc_result = (
        supabase.table("tool_categories")
        .select("tool_id, categories(name)")
        .in_("tool_id", tool_ids)
        .execute()
    )
    cat_map: dict[str, list[str]] = {}
    for row in tc_result.data or []:
        tid = row["tool_id"]
        cat_name = (row.get("categories") or {}).get("name", "")
        if cat_name:
            cat_map.setdefault(tid, []).append(cat_name)

    for tool in tools:
        tool["is_favorite"] = tool["id"] in fav_ids
        tool["categories"] = cat_map.get(tool["id"], [])

    return tools


@router.get("", response_model=ToolListResponse)
async def list_tools(
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    pricing: Optional[str] = Query(None),
    favorites_only: bool = Query(False),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    offset = (page - 1) * limit

    query = supabase.table("tools").select("*", count="exact")

    if search:
        query = query.ilike("name", f"%{search}%")

    if pricing:
        query = query.eq("pricing_model", pricing)

    if favorites_only:
        fav_result = supabase.table("favorites").select("tool_id").execute()
        fav_ids = [r["tool_id"] for r in (fav_result.data or [])]
        if not fav_ids:
            return ToolListResponse(tools=[], total=0)
        query = query.in_("id", fav_ids)

    query = query.order("created_at", desc=True).range(offset, offset + limit - 1)
    result = query.execute()

    tools = result.data or []
    total = result.count or 0

    # Filter by category (post-query because it requires a join)
    if category:
        tc_result = (
            supabase.table("tool_categories")
            .select("tool_id, categories!inner(slug)")
            .eq("categories.slug", category)
            .execute()
        )
        matching_ids = {r["tool_id"] for r in (tc_result.data or [])}
        tools = [t for t in tools if t["id"] in matching_ids]
        total = len(tools)

    tools = _attach_meta(tools)
    return ToolListResponse(tools=tools, total=total)


@router.get("/categories")
async def list_categories():
    result = supabase.table("categories").select("*").order("name").execute()
    return result.data or []


@router.get("/{slug}", response_model=ToolOut)
async def get_tool(slug: str):
    result = (
        supabase.table("tools").select("*").eq("slug", slug).single().execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Tool not found.")
    tools = _attach_meta([result.data])
    return tools[0]


@router.post("/{tool_id}/favorite")
async def toggle_favorite(tool_id: str):
    existing = (
        supabase.table("favorites").select("id").eq("tool_id", tool_id).execute()
    )
    if existing.data:
        supabase.table("favorites").delete().eq("tool_id", tool_id).execute()
        return {"is_favorite": False}
    else:
        supabase.table("favorites").insert({"tool_id": tool_id}).execute()
        return {"is_favorite": True}
