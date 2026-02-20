from pydantic import BaseModel, Field


class IngestRequest(BaseModel):
    url: str = Field(..., description="YouTube video URL")


class IngestResponse(BaseModel):
    status: str
    video_id: str
    video_title: str
    chunks_added: int
    message: str
