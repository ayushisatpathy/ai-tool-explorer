from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import admin, tools

app = FastAPI(
    title="AI Tool Explorer API",
    version="1.0.0",
    description="Scrapes, stores and serves AI tools from Aixploria.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(admin.router)
app.include_router(tools.router)


@app.get("/")
async def root():
    return {"status": "ok", "message": "AI Tool Explorer API is running."}


@app.get("/health")
async def health():
    return {"status": "healthy"}
