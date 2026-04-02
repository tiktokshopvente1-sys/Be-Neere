from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models.database import get_db, Progress
from models.schemas import QuizAnswerRequest, QuizAnswerResponse, QuizQuestion
from services.quiz_service import get_vocabulary_quiz, get_dynamic_quiz
from datetime import datetime

router = APIRouter()


@router.get("/progress/all")
async def get_all_progress(db: Session = Depends(get_db)):
    all_progress = db.query(Progress).filter(Progress.user_id == 1).all()
    return [
        {
            "language": p.language,
            "score": round(p.score, 1),
            "total_quizzes": p.total_quizzes,
            "correct_answers": p.correct_answers,
            "streak": p.streak,
        }
        for p in all_progress
    ]


@router.get("/progress/{language}")
async def get_progress(language: str, db: Session = Depends(get_db)):
    progress = db.query(Progress).filter(Progress.language == language).first()
    if not progress:
        return {"language": language, "score": 0, "total_quizzes": 0, "correct_answers": 0, "streak": 0}
    return {
        "language": language,
        "score": round(progress.score, 1),
        "total_quizzes": progress.total_quizzes,
        "correct_answers": progress.correct_answers,
        "streak": progress.streak,
    }


@router.post("/answer", response_model=QuizAnswerResponse)
async def submit_answer(request: QuizAnswerRequest, db: Session = Depends(get_db)):
    is_correct = request.user_answer.strip().lower() == request.correct_answer.strip().lower()
    score_update = 10.0 if is_correct else 0.0

    progress = db.query(Progress).filter(Progress.language == request.language).first()
    if not progress:
        progress = Progress(language=request.language, user_id=1)
        db.add(progress)

    progress.total_quizzes += 1
    if is_correct:
        progress.correct_answers += 1
        progress.streak += 1
    else:
        progress.streak = 0
    progress.score = (progress.correct_answers / progress.total_quizzes) * 100
    progress.last_activity = datetime.utcnow()
    db.commit()

    explanation = "Bonne réponse !" if is_correct else f"La bonne réponse était: {request.correct_answer}"

    return QuizAnswerResponse(
        is_correct=is_correct,
        explanation=explanation,
        score_update=score_update,
    )


@router.get("/{language}", response_model=QuizQuestion)
async def get_quiz(language: str, level: str = "debutant", topic: str = None, mode: str = "vocabulary"):
    if mode == "vocabulary":
        data = await get_vocabulary_quiz(language)
    else:
        data = await get_dynamic_quiz(language, level, topic)
    return QuizQuestion(**data)
