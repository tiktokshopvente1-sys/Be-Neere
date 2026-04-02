from pydantic import BaseModel
from typing import List, Optional


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    language: str
    conversation_history: List[ChatMessage] = []


class ChatResponse(BaseModel):
    reply: str
    language: str
    conversation_history: List[ChatMessage]


class TranslateRequest(BaseModel):
    text: str
    source_lang: str
    target_lang: str


class TranslateResponse(BaseModel):
    translated_text: str
    source_lang: str
    target_lang: str


class GrammarRequest(BaseModel):
    text: str
    language: str


class GrammarResponse(BaseModel):
    corrected_text: str
    explanation: str
    language: str


class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct_answer: str
    explanation: str
    question_type: str


class QuizRequest(BaseModel):
    language: str
    level: str = "debutant"
    topic: Optional[str] = None


class QuizAnswerRequest(BaseModel):
    language: str
    question: str
    user_answer: str
    correct_answer: str


class QuizAnswerResponse(BaseModel):
    is_correct: bool
    explanation: str
    score_update: float


class TTSRequest(BaseModel):
    text: str
    language: str


class ProgressResponse(BaseModel):
    language: str
    score: float
    total_quizzes: int
    correct_answers: int
    streak: int
