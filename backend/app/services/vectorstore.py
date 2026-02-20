import uuid

import chromadb
from langchain.schema import Document

from app.config import settings
from app.services.embeddings import get_embeddings

_chroma_client = None
_collection = None


def get_client() -> chromadb.EphemeralClient:
    """Return singleton ChromaDB in-memory client."""
    global _chroma_client
    if _chroma_client is None:
        _chroma_client = chromadb.EphemeralClient()
    return _chroma_client


def get_collection():
    """Return singleton ChromaDB collection."""
    global _collection
    if _collection is None:
        client = get_client()
        _collection = client.get_or_create_collection(
            name=settings.chroma_collection_name,
            metadata={"hnsw:space": "cosine"},
        )
    return _collection


def video_already_indexed(video_id: str) -> bool:
    """Check if any chunk exists with this video_id in metadata."""
    collection = get_collection()
    results = collection.get(
        where={"video_id": video_id},
        limit=1,
        include=[],
    )
    return len(results["ids"]) > 0


def add_documents(documents: list[Document]) -> int:
    """Embed and add documents to in-memory ChromaDB. Returns count added."""
    if not documents:
        return 0

    collection = get_collection()
    embeddings = get_embeddings()

    texts = [doc.page_content for doc in documents]
    metadatas = [doc.metadata for doc in documents]
    ids = [str(uuid.uuid4()) for _ in documents]

    vectors = embeddings.embed_documents(texts)

    collection.add(
        ids=ids,
        embeddings=vectors,
        documents=texts,
        metadatas=metadatas,
    )

    return len(documents)


def similarity_search(
    query: str,
    video_ids: list[str] | None = None,
    k: int = 5,
) -> list[Document]:
    """
    Semantic search with optional video_id filter.
    Returns top-k Documents with full metadata.
    """
    collection = get_collection()
    embeddings = get_embeddings()

    query_vector = embeddings.embed_query(query)

    where_filter = None
    if video_ids:
        if len(video_ids) == 1:
            where_filter = {"video_id": video_ids[0]}
        else:
            where_filter = {"video_id": {"$in": video_ids}}

    results = collection.query(
        query_embeddings=[query_vector],
        n_results=k,
        where=where_filter,
        include=["documents", "metadatas", "distances"],
    )

    documents = []
    if results["documents"] and results["documents"][0]:
        for doc_text, metadata in zip(
            results["documents"][0], results["metadatas"][0]
        ):
            documents.append(
                Document(page_content=doc_text, metadata=metadata)
            )

    return documents


def get_all_indexed_videos() -> list[dict]:
    """
    Scan collection metadata for unique video_ids.
    Returns list of {video_id, video_title, video_url, chunk_count}.
    """
    collection = get_collection()

    all_data = collection.get(include=["metadatas"])

    video_map: dict[str, dict] = {}
    for metadata in all_data["metadatas"]:
        vid = metadata["video_id"]
        if vid not in video_map:
            video_map[vid] = {
                "video_id": vid,
                "video_title": metadata.get("video_title", vid),
                "video_url": metadata.get("video_url", ""),
                "chunk_count": 0,
            }
        video_map[vid]["chunk_count"] += 1

    return list(video_map.values())


def delete_video(video_id: str) -> int:
    """Delete all chunks for a video_id. Returns count deleted."""
    collection = get_collection()
    results = collection.get(where={"video_id": video_id}, include=[])
    ids_to_delete = results["ids"]
    if ids_to_delete:
        collection.delete(ids=ids_to_delete)
    return len(ids_to_delete)
