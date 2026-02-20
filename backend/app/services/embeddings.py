from langchain_huggingface import HuggingFaceEmbeddings

from app.config import settings

_embeddings_instance = None


def get_embeddings() -> HuggingFaceEmbeddings:
    """Return singleton HuggingFace embeddings instance."""
    global _embeddings_instance
    if _embeddings_instance is None:
        _embeddings_instance = HuggingFaceEmbeddings(
            model_name=settings.embedding_model,
            model_kwargs={"device": "cpu"},
            encode_kwargs={"normalize_embeddings": True},
        )
    return _embeddings_instance
