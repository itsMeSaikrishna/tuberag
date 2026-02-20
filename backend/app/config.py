from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    groq_api_key: str = ""
    chroma_collection_name: str = "youtube_transcripts"
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    groq_model: str = "llama-3.3-70b-versatile"
    top_k: int = 5
    chunk_size: int = 1000
    chunk_overlap: int = 200
    allowed_origins: str = "http://localhost:5173"

    @property
    def origins_list(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",")]

    class Config:
        env_file = ".env"


settings = Settings()
