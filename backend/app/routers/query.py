from fastapi import APIRouter, Request
from sse_starlette.sse import EventSourceResponse

from app.config import settings
from app.services.vectorstore import similarity_search
from app.services.llm import stream_answer

router = APIRouter()


@router.get("/api/query")
async def query_endpoint(
    q: str,
    request: Request,
    video_ids: str | None = None,
):
    """Stream an AI-generated answer based on indexed video transcripts."""
    parsed_video_ids = (
        [v.strip() for v in video_ids.split(",") if v.strip()]
        if video_ids
        else None
    )

    async def event_generator():
        chunks = similarity_search(q, parsed_video_ids, k=settings.top_k)
        async for event_data in stream_answer(q, chunks):
            if await request.is_disconnected():
                break
            yield {"data": event_data}

    return EventSourceResponse(event_generator())
