from fastapi import APIRouter, BackgroundTasks, HTTPException
from datetime import datetime, timezone
from app.database import supabase
from app.schemas import ScrapeResponse, ScrapeRunOut
from app.scraper.scraper import scrape

router = APIRouter(prefix="/api/admin", tags=["admin"])


def _run_scrape(run_id: str) -> None:
    try:
        scrape(run_id)
    except Exception:
        pass  # errors already logged in scrape()


@router.post("/scrape", response_model=ScrapeResponse)
async def trigger_scrape(background_tasks: BackgroundTasks):
    """Trigger the AI tools scraper as a background task."""
    # Check if a run is already in progress
    active = (
        supabase.table("scrape_runs")
        .select("id")
        .eq("status", "running")
        .execute()
    )
    if active.data:
        raise HTTPException(status_code=409, detail="A scrape is already running.")

    # Create a new run record
    result = (
        supabase.table("scrape_runs")
        .insert({"status": "running", "started_at": datetime.now(timezone.utc).isoformat()})
        .execute()
    )
    run_id = result.data[0]["id"]

    background_tasks.add_task(_run_scrape, run_id)

    return ScrapeResponse(run_id=run_id, message="Scrape started successfully.")


@router.get("/scrape/runs", response_model=list[ScrapeRunOut])
async def list_scrape_runs(limit: int = 10):
    """Return recent scrape run logs."""
    result = (
        supabase.table("scrape_runs")
        .select("*")
        .order("started_at", desc=True)
        .limit(limit)
        .execute()
    )
    return result.data or []


@router.get("/scrape/runs/{run_id}", response_model=ScrapeRunOut)
async def get_scrape_run(run_id: str):
    result = (
        supabase.table("scrape_runs")
        .select("*")
        .eq("id", run_id)
        .single()
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Run not found.")
    return result.data
