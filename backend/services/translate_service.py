from services.llm_service import translate_with_llm

SUPPORTED_DIRECT = [("fr", "en"), ("en", "fr")]


async def translate(text: str, source_lang: str, target_lang: str) -> str:
    if source_lang == target_lang:
        return text
    return await translate_with_llm(text, source_lang, target_lang)
