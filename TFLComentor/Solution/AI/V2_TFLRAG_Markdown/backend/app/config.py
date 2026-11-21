import os
from pathlib import Path
from dotenv import load_dotenv

BACKEND_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BACKEND_DIR / ".env")

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434").rstrip("/")
CHAT_MODEL = os.getenv("CHAT_MODEL", "qwen3.5:4b")
EMBED_MODEL = os.getenv("EMBED_MODEL", "nomic-embed-text")
TOP_K = int(os.getenv("TOP_K", "4"))
CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", "900"))
CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", "150"))

DATA_DIR = BACKEND_DIR / "data"
UPLOAD_DIR = DATA_DIR / "uploads"
INDEX_PATH = DATA_DIR / "faiss.index"
RECORDS_PATH = DATA_DIR / "records.json"
DOCUMENTS_PATH = DATA_DIR / "documents.json"

for path in (DATA_DIR, UPLOAD_DIR):
    path.mkdir(parents=True, exist_ok=True)
