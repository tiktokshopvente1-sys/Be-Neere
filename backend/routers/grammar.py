from fastapi import APIRouter
from models.schemas import GrammarRequest, GrammarResponse
from services.llm_service import correct_grammar

router = APIRouter()


@router.post("/check", response_model=GrammarResponse)
async def check_grammar(request: GrammarRequest):
    result = await correct_grammar(request.text, request.language)
    return GrammarResponse(
        corrected_text=result.get("corrected_text", request.text),
        explanation=result.get("explanation", "Aucune erreur détectée."),
        language=request.language,
    )
