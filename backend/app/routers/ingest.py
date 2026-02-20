from fastapi import APIRouter

from app.models.ingest import IngestRequest, IngestResponse
from app.services.transcript import get_transcript
from app.services.chunker import chunk_transcript
from app.services.vectorstore import video_already_indexed, add_documents

router = APIRouter()


@router.post("/api/ingest", response_model=IngestResponse)
async def ingest_video(request: IngestRequest):
    """Index a YouTube video's transcript into the vector store."""
    video_id, segments, title = get_transcript(request.url)

    if video_already_indexed(video_id):
        return IngestResponse(
            status="already_indexed",
            video_id=video_id,
            video_title=title,
            chunks_added=0,
            message=f"Video {video_id} is already indexed.",
        )

    documents = chunk_transcript(segments, video_id, request.url, title)
    count = add_documents(documents)

    return IngestResponse(
        status="success",
        video_id=video_id,
        video_title=title,
        chunks_added=count,
        message=f"Successfully indexed {count} chunks from video.",
    )
