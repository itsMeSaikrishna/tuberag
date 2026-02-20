from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document

from app.config import settings


def format_time(seconds: float) -> str:
    """Convert seconds to MM:SS format."""
    mins = int(seconds) // 60
    secs = int(seconds) % 60
    return f"{mins:02d}:{secs:02d}"


def chunk_transcript(
    segments: list[dict],
    video_id: str,
    video_url: str,
    video_title: str,
) -> list[Document]:
    """
    Merge transcript segments, split into chunks, and attach metadata.

    Strategy:
    1. Merge all segment text, tracking character offset -> segment mapping
    2. Split with RecursiveCharacterTextSplitter
    3. Map each chunk back to its source segment for timestamp metadata
    """
    # Build full text and track offsets
    full_text = ""
    offset_to_segment: list[tuple[int, dict]] = []

    for seg in segments:
        offset_to_segment.append((len(full_text), seg))
        full_text += seg["text"] + " "

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.chunk_size,
        chunk_overlap=settings.chunk_overlap,
        separators=["\n\n", "\n", ". ", " ", ""],
    )

    text_chunks = splitter.split_text(full_text)

    documents = []
    for chunk_text in text_chunks:
        # Find the segment this chunk starts in
        chunk_start = full_text.find(chunk_text)
        start_time = 0.0

        for offset, seg in reversed(offset_to_segment):
            if offset <= chunk_start:
                start_time = seg["start"]
                break

        doc = Document(
            page_content=chunk_text,
            metadata={
                "video_id": video_id,
                "video_url": video_url,
                "video_title": video_title,
                "start_time": start_time,
                "start_time_formatted": format_time(start_time),
            },
        )
        documents.append(doc)

    return documents
