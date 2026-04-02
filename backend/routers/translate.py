from fastapi import APIRouter
from models.schemas import TranslateRequest, TranslateResponse
from services.translate_service import translate

router = APIRouter()


@router.post("", response_model=TranslateResponse)
async def translate_text(request: TranslateRequest):
    result = await translate(request.text, request.source_lang, request.target_lang)
    return TranslateResponse(
        translated_text=result,
        source_lang=request.source_lang,
        target_lang=request.target_lang,
    )
