from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CategoryOut(BaseModel):
    id: str
    name: str
    slug: str


class ToolOut(BaseModel):
    id: str
    name: str
    slug: str
    description: Optional[str] = None
    url: str
    canonical_url: str
    logo_url: Optional[str] = None
    pricing_model: str
    last_seen_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    is_favorite: bool = False
    categories: list[str] = []


class ToolListResponse(BaseModel):
    tools: list[ToolOut]
    total: int


class ScrapeRunOut(BaseModel):
    id: str
    status: str
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    tools_scraped: int = 0
    error_message: Optional[str] = None


class ScrapeResponse(BaseModel):
    run_id: str
    message: str
