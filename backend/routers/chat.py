from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models.database import get_db, ChatSession
from models.schemas import ChatRequest, ChatResponse, ChatMessage
from services.llm_service import chat_with_llm
import json

router = APIRouter()


@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest, db: Session = Depends(get_db)):
    history_dicts = [{"role": m.role, "content": m.content} for m in request.conversation_history]

    reply = await chat_with_llm(request.message, request.language, history_dicts)

    new_history = request.conversation_history + [
        ChatMessage(role="user", content=request.message),
        ChatMessage(role="assistant", content=reply),
    ]

    return ChatResponse(
        reply=reply,
        language=request.language,
        conversation_history=new_history
    )


@router.get("/vocabulary/{language}")
async def get_vocabulary(language: str):
    from services.quiz_service import load_language_data
    data = load_language_data(language)
    if not data:
        return {"language": language, "vocabulary": [], "message": "Données non disponibles en local, utiliser le LLM"}
    return {
        "language": language,
        "name": data.get("name", language),
        "greetings": data.get("greetings", []),
        "numbers": data.get("numbers", []),
        "common_phrases": data.get("common_phrases", []),
        "colors": data.get("colors", []),
    }
