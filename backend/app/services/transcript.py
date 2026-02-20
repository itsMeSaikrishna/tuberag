import re
from fastapi import HTTPException
from youtube_transcript_api import YouTubeTranscriptApi


def extract_video_id(url: str) -> str:
    """Extract video ID from various YouTube URL formats."""
    patterns = [
        r"(?:v=|/v/|youtu\.be/|/embed/|/shorts/)([a-zA-Z0-9_-]{11})",
        r"^([a-zA-Z0-9_-]{11})$",
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    raise HTTPException(status_code=400, detail="Invalid YouTube URL")


def get_transcript(video_url: str) -> tuple[str, list[dict], str]:
    """
    Fetch transcript for a YouTube video.

    Returns:
        - video_id: str
        - segments: list of {"text": str, "start": float, "duration": float}
        - title: str (uses video_id as fallback)
    """
    video_id = extract_video_id(video_url)

    try:
        api = YouTubeTranscriptApi()
        transcript = api.fetch(video_id)
        segments = [
            {"text": s.text, "start": s.start, "duration": s.duration}
            for s in transcript
        ]
    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail=f"Could not fetch transcript for video {video_id}: {str(e)}",
        )

    # Use video_id as title fallback — avoids extra dependency
    title = video_id

    return video_id, segments, title
