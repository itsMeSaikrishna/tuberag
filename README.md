# TubeRag - YouTube RAG Chat

Paste a YouTube URL, index its transcript with vector embeddings, then ask natural-language questions and get AI-streamed answers with timestamp citations.

## Stack

- **Backend**: FastAPI, ChromaDB, Sentence Transformers, Groq (Llama 3.3)
- **Frontend**: React, TypeScript, Tailwind CSS, React Query, Vite

## Quick Start

### Backend

```bash
cd backend
cp .env.example .env     # Add your GROQ_API_KEY
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 — the Vite dev server proxies `/api` requests to the backend on port 8000.

## Usage

1. **Index** — Paste a YouTube URL on the Index page to fetch and embed its transcript.
2. **Chat** — Switch to the Chat page and ask questions. Answers stream in with timestamp citations linking back to the video.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/ingest` | Index a YouTube video transcript |
| GET | `/api/videos` | List all indexed videos |
| DELETE | `/api/videos/:id` | Remove an indexed video |
| GET | `/api/query?q=...` | Stream AI answer via SSE |

## Deployment

- **Backend**: Deploy to Render using `render.yaml`
- **Frontend**: Deploy to Vercel using `vercel.json`
