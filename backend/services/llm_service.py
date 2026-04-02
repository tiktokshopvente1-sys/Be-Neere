import os
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv()

client = AsyncOpenAI(
    api_key=os.getenv("GROQ_API_KEY", ""),
    base_url="https://api.groq.com/openai/v1",
)

MODEL = "llama-3.3-70b-versatile"

LANGUAGE_PROMPTS = {
    "fr": "Tu es un professeur de français natif, bienveillant et pédagogue. Tu aides l'apprenant à progresser en français.",
    "en": "You are a native English teacher, kind and pedagogical. You help the learner improve their English.",
    "moore": (
        "Tu es un locuteur natif du Mooré (langue parlée au Burkina Faso). "
        "Tu aides l'apprenant à apprendre le Mooré. Réponds en Mooré avec la traduction en français entre parenthèses. "
        "Sois patient et pédagogue. Utilise des exemples simples tirés de la vie quotidienne."
    ),
    "dioula": (
        "Tu es un locuteur natif du Dioula (langue parlée au Burkina Faso, Côte d'Ivoire et Mali). "
        "Tu aides l'apprenant à apprendre le Dioula. Réponds en Dioula avec la traduction en français entre parenthèses. "
        "Sois patient et pédagogue."
    ),
    "peulh": (
        "Tu es un locuteur natif du Peulh / Fulfulde (langue parlée en Afrique de l'Ouest). "
        "Tu aides l'apprenant à apprendre le Peulh. Réponds en Peulh avec la traduction en français entre parenthèses. "
        "Sois patient et pédagogue."
    ),
}


async def chat_with_llm(message: str, language: str, history: list) -> str:
    system_prompt = LANGUAGE_PROMPTS.get(language, LANGUAGE_PROMPTS["fr"])

    messages = [{"role": "system", "content": system_prompt}]
    for h in history[-10:]:
        messages.append({"role": h["role"], "content": h["content"]})
    messages.append({"role": "user", "content": message})

    response = await client.chat.completions.create(
        model=MODEL,
        messages=messages,
        max_tokens=500,
        temperature=0.7,
    )
    return response.choices[0].message.content


async def correct_grammar(text: str, language: str) -> dict:
    lang_names = {
        "fr": "français", "en": "anglais",
        "moore": "mooré", "dioula": "dioula", "peulh": "peulh (fulfulde)"
    }
    lang_name = lang_names.get(language, language)

    prompt = (
        f"Tu es un expert en {lang_name}. "
        f"Corrige le texte suivant et explique les erreurs en français.\n\n"
        f"Texte: {text}\n\n"
        f"Réponds UNIQUEMENT en JSON valide avec exactement ces deux champs: "
        f'{{ "corrected_text": "...", "explanation": "..." }}'
    )

    response = await client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=400,
        temperature=0.3,
    )
    import json
    content = response.choices[0].message.content.strip()
    # Extraire le JSON si entouré de markdown
    if "```" in content:
        content = content.split("```")[1]
        if content.startswith("json"):
            content = content[4:]
    return json.loads(content)


async def generate_quiz(language: str, level: str = "debutant", topic: str = None) -> dict:
    lang_names = {
        "fr": "français", "en": "anglais",
        "moore": "mooré", "dioula": "dioula", "peulh": "peulh (fulfulde)"
    }
    lang_name = lang_names.get(language, language)
    topic_str = f" sur le thème: {topic}" if topic else ""

    prompt = (
        f"Génère une question de quiz pour apprendre le {lang_name} (niveau {level}){topic_str}.\n"
        f"Réponds UNIQUEMENT en JSON valide avec exactement ces champs: "
        f'{{ "question": "...", "options": ["A", "B", "C", "D"], "correct_answer": "...", "explanation": "...", "question_type": "qcm" }}'
    )

    response = await client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=400,
        temperature=0.8,
    )
    import json
    content = response.choices[0].message.content.strip()
    if "```" in content:
        content = content.split("```")[1]
        if content.startswith("json"):
            content = content[4:]
    return json.loads(content)


async def translate_with_llm(text: str, source_lang: str, target_lang: str) -> str:
    lang_names = {
        "fr": "français", "en": "anglais",
        "moore": "mooré", "dioula": "dioula", "peulh": "peulh (fulfulde)"
    }
    src = lang_names.get(source_lang, source_lang)
    tgt = lang_names.get(target_lang, target_lang)

    prompt = (
        f"Traduis ce texte du {src} vers le {tgt}. "
        f"Donne uniquement la traduction, sans commentaire ni explication.\n\n"
        f"Texte: {text}"
    )

    response = await client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=300,
        temperature=0.2,
    )
    return response.choices[0].message.content.strip()
