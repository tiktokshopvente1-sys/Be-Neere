from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from routers import chat, translate, quiz, grammar, voice
from models.database import init_db

app = FastAPI(
    title="IA Multilingue - Apprendre les Langues",
    description="Application d'apprentissage des langues : Français, Anglais, Mooré, Dioula, Peulh",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("audio_cache", exist_ok=True)
app.mount("/audio", StaticFiles(directory="audio_cache"), name="audio")

app.include_router(chat.router, prefix="/chat", tags=["Chatbot"])
app.include_router(translate.router, prefix="/translate", tags=["Traduction"])
app.include_router(quiz.router, prefix="/quiz", tags=["Quiz"])
app.include_router(grammar.router, prefix="/grammar", tags=["Grammaire"])
app.include_router(voice.router, prefix="/voice", tags=["Voix"])


@app.on_event("startup")
async def startup_event():
    init_db()


@app.get("/")
async def root():
    return {"message": "IA Multilingue API - Bienvenue / Welcome / Laafi / I ni ce / Jam waawi"}


@app.get("/languages")
async def get_languages():
    return {
        "languages": [
            {"code": "fr", "name": "Français", "flag": "🇫🇷"},
            {"code": "en", "name": "English", "flag": "🇬🇧"},
            {"code": "moore", "name": "Mooré", "flag": "🇧🇫"},
            {"code": "dioula", "name": "Dioula", "flag": "🇧🇫"},
            {"code": "peulh", "name": "Peulh (Fulfulde)", "flag": "🇧🇫"},
        ]
    }
