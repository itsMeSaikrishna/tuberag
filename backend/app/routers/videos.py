from fastapi import APIRouter, HTTPException

from app.models.query import VideoInfo
from app.services.vectorstore import get_all_indexed_videos, delete_video

router = APIRouter()


@router.get("/api/videos", response_model=list[VideoInfo])
async def list_videos():
    """Return all indexed videos with metadata."""
    return get_all_indexed_videos()


@router.delete("/api/videos/{video_id}")
async def remove_video(video_id: str):
    """Remove all chunks for a video from the vector store."""
    count = delete_video(video_id)
    if count == 0:
        raise HTTPException(status_code=404, detail="Video not found")
    return {"status": "deleted", "video_id": video_id, "chunks_deleted": count}
