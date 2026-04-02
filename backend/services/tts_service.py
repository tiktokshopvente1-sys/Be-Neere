import os
import hashlib
from gtts import gTTS

GTTS_LANG_MAP = {
    "fr": "fr",
    "en": "en",
    "moore": "fr",
    "dioula": "fr",
    "peulh": "fr",
}

AUDIO_DIR = "audio_cache"


def generate_tts(text: str, language: str) -> str:
    lang_code = GTTS_LANG_MAP.get(language, "fr")
    text_hash = hashlib.md5(f"{language}:{text}".encode()).hexdigest()
    filename = f"{text_hash}.mp3"
    filepath = os.path.join(AUDIO_DIR, filename)

    if not os.path.exists(filepath):
        tts = gTTS(text=text, lang=lang_code, slow=False)
        tts.save(filepath)

    return filename
