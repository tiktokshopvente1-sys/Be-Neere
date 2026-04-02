from fastapi import APIRouter
from fastapi.responses import FileResponse
from models.schemas import TTSRequest
from services.tts_service import generate_tts
import os

router = APIRouter()


@router.post("/tts")
async def text_to_speech(request: TTSRequest):
    filename = generate_tts(request.text, request.language)
    filepath = os.path.join("audio_cache", filename)
    return {"audio_url": f"/audio/{filename}"}


@router.get("/tts/file/{filename}")
async def get_audio_file(filename: str):
    filepath = os.path.join("audio_cache", filename)
    if os.path.exists(filepath):
        return FileResponse(filepath, media_type="audio/mpeg")
    return {"error": "Fichier non trouvé"}
