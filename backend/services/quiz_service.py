import json
import os
from services.llm_service import generate_quiz as llm_generate_quiz

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "languages")


def load_language_data(language: str) -> dict:
    path = os.path.join(DATA_DIR, f"{language}.json")
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


async def get_vocabulary_quiz(language: str) -> dict:
    data = load_language_data(language)
    if not data:
        return await llm_generate_quiz(language, "debutant", "vocabulaire de base")

    import random
    all_words = data.get("greetings", []) + data.get("numbers", []) + data.get("common_phrases", [])
    if not all_words:
        return await llm_generate_quiz(language, "debutant")

    word = random.choice(all_words)
    key = language if language in word else list(word.keys())[0]
    answer = word.get("french", "")
    question_word = word.get(key, word.get(list(word.keys())[0], ""))

    other_words = [w for w in all_words if w != word]
    random.shuffle(other_words)
    wrong = [w.get("french", "") for w in other_words[:3] if w.get("french")][:3]

    options = wrong + [answer]
    random.shuffle(options)

    return {
        "question": f"Que signifie '{question_word}' en {language} ?",
        "options": options,
        "correct_answer": answer,
        "explanation": f"'{question_word}' signifie '{answer}' en français.",
        "question_type": "qcm"
    }


async def get_dynamic_quiz(language: str, level: str = "debutant", topic: str = None) -> dict:
    return await llm_generate_quiz(language, level, topic)
