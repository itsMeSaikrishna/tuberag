from pydantic import BaseModel


class Citation(BaseModel):
    video_id: str
    video_title: str
    start_time: float
    start_time_formatted: str
    video_url: str
    youtube_url_with_timestamp: str


class VideoInfo(BaseModel):
    video_id: str
    video_title: str
    video_url: str
    chunk_count: int
