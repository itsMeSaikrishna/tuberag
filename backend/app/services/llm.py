import json
from collections.abc import AsyncGenerator

from groq import Groq
from langchain.schema import Document

from app.config import settings


def build_prompt(query: str, chunks: list[Document]) -> list[dict]:
    """Build messages list for Groq chat completion."""
    system_message = (
        "You are an expert at answering questions about YouTube video content. "
        "Answer based ONLY on the provided transcript excerpts. "
        "Be concise and accurate. If the answer isn't in the excerpts, say so. "
        "Do not make up information."
    )

    context_parts = []
    for i, chunk in enumerate(chunks, 1):
        meta = chunk.metadata
        timestamp = meta.get("start_time_formatted", "00:00")
        title = meta.get("video_title", "Unknown")
        context_parts.append(
            f"[Excerpt {i} | Video: {title} | Timestamp: {timestamp}]\n"
            f"{chunk.page_content}"
        )

    context = "\n\n---\n\n".join(context_parts)

    user_message = (
        f"Transcript excerpts:\n\n{context}\n\n---\n\n"
        f"Question: {query}"
    )

    return [
        {"role": "system", "content": system_message},
        {"role": "user", "content": user_message},
    ]


def extract_citations(chunks: list[Document]) -> list[dict]:
    """Extract citation metadata from chunks."""
    seen = set()
    citations = []
    for chunk in chunks:
        meta = chunk.metadata
        key = (meta["video_id"], meta["start_time"])
        if key in seen:
            continue
        seen.add(key)
        citations.append(
            {
                "video_id": meta["video_id"],
                "video_title": meta.get("video_title", ""),
                "start_time": meta["start_time"],
                "start_time_formatted": meta.get("start_time_formatted", "00:00"),
                "video_url": meta.get("video_url", ""),
                "youtube_url_with_timestamp": (
                    f"https://www.youtube.com/watch?v={meta['video_id']}"
                    f"&t={int(meta['start_time'])}s"
                ),
            }
        )
    return citations


async def stream_answer(
    query: str, chunks: list[Document]
) -> AsyncGenerator[str, None]:
    """
    Async generator that yields JSON-encoded SSE event data.
    Streams tokens from Groq, then sends citations and done signal.
    """
    if not chunks:
        yield json.dumps(
            {
                "type": "chunk",
                "content": "I couldn't find any relevant content in the indexed videos to answer your question.",
            }
        )
        yield json.dumps({"type": "citations", "citations": []})
        yield json.dumps({"type": "done"})
        return

    client = Groq(api_key=settings.groq_api_key)
    messages = build_prompt(query, chunks)

    stream = client.chat.completions.create(
        model=settings.groq_model,
        messages=messages,
        stream=True,
        max_tokens=1024,
        temperature=0.1,
    )

    for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            yield json.dumps({"type": "chunk", "content": delta})

    citations = extract_citations(chunks)
    yield json.dumps({"type": "citations", "citations": citations})
    yield json.dumps({"type": "done"})
