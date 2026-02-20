from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import ingest, query, videos

app = FastAPI(
    title="YouTube RAG API",
    description="RAG pipeline for YouTube video transcripts",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ingest.router)
app.include_router(query.router)
app.include_router(videos.router)


@app.get("/")
async def health_check():
    return {"status": "ok"}
