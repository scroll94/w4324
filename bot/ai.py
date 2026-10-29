"""Мозг бота. Не зависит от Telegram — им же пользуется сайт (web.py).

Какой ИИ работает, решает строка AI_PROVIDER в .env: gemini или anthropic.
"""
import os
from collections import defaultdict
from pathlib import Path

import anthropic
from dotenv import load_dotenv
from google import genai
from google.genai import errors as genai_errors
from google.genai import types as genai_types

load_dotenv()

PROVIDER = os.getenv("AI_PROVIDER", "gemini").strip().lower()
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.1-flash-lite")
TIMEOUT_SECONDS = 40  # чтобы бот не завис на сцене, если ИИ тормозит
CLAUDE_MODEL = os.getenv("CLAUDE_MODEL", "claude-haiku-5-5")
MAX_HISTORY = 20  # сколько последних сообщений помнить на одного пользователя

# Роль ИИ — в prompt.txt (его же читает облачный чат worker/). Поменяй под кейс хакатона.
HERE = Path(__file__).resolve().parent
SYSTEM_PROMPT = (HERE / "prompt.txt").read_text(encoding="utf-8").strip()

# те же данные, что показывает дашборд
DATA_FILE = HERE.parent / "dashboard" / "src" / "data.json"
try:
    SYSTEM_PROMPT += "\n\nДАННЫЕ:\n" + DATA_FILE.read_text(encoding="utf-8")
except OSError:
    pass  # нет файла — бот просто работает без данных

# история: user_id -> [{"role": "user" | "assistant", "text": "..."}]
_history: dict[int, list[dict]] = defaultdict(list)
_clients: dict[str, object] = {}


class AIError(Exception):
    """Ошибка, которую можно показать пользователю как есть."""


def _key(name: str) -> str:
    key = os.getenv(name, "").strip()
    if not key:
        raise AIError(f"{name} пустой — вставь ключ в файл bot/.env")
    return key


# ---------- Gemini ----------

async def _ask_gemini(history: list[dict]) -> str:
    if "gemini" not in _clients:
        _clients["gemini"] = genai.Client(
            api_key=_key("GEMINI_API_KEY"),
            http_options=genai_types.HttpOptions(timeout=TIMEOUT_SECONDS * 1000),
        )
    contents = [
        genai_types.Content(role="model" if m["role"] == "assistant" else "user",
                            parts=[genai_types.Part(text=m["text"])])
        for m in history
    ]
    try:
        response = await _clients["gemini"].aio.models.generate_content(
            model=GEMINI_MODEL,
            contents=contents,
            config=genai_types.GenerateContentConfig(system_instruction=SYSTEM_PROMPT),
        )
    except genai_errors.APIError as e:
        if e.code in (400, 401, 403) and "API key" in str(e):
            raise AIError("Неверный GEMINI_API_KEY — проверь ключ в bot/.env")
        if e.code == 404:
            raise AIError(f"Модель {GEMINI_MODEL} не найдена — поменяй GEMINI_MODEL в bot/.env")
        if e.code == 429:
            raise AIError("⏳ Лимит бесплатных запросов Gemini, подожди минуту.")
        if e.code in (503, 504):
            raise AIError("⏳ Gemini сейчас перегружен, попробуй ещё раз через пару секунд.")
        raise AIError(f"Ошибка Gemini ({e.code}). Попробуй ещё раз.")
    return response.text or ""


# ---------- Claude (Anthropic) ----------

async def _ask_claude(history: list[dict]) -> str:
    if "anthropic" not in _clients:
        _clients["anthropic"] = anthropic.AsyncAnthropic(
            api_key=_key("ANTHROPIC_API_KEY"), timeout=TIMEOUT_SECONDS, max_retries=1
        )
    try:
        response = await _clients["anthropic"].messages.create(
            model=CLAUDE_MODEL,
            max_tokens=4000,
            system=SYSTEM_PROMPT,
            messages=[{"role": m["role"], "content": m["text"]} for m in history],
            output_config={"effort": "low"},  # для чата быстрее и дешевле
        )
    except anthropic.AuthenticationError:
        raise AIError("Неверный ANTHROPIC_API_KEY — проверь ключ в bot/.env")
    except anthropic.RateLimitError:
        raise AIError("⏳ Слишком много запросов, подожди пару секунд.")
    except anthropic.APIStatusError as e:
        raise AIError(f"Ошибка Claude API ({e.status_code}). Попробуй ещё раз.")
    if response.stop_reason == "refusal":
        return "Извини, на такой запрос я ответить не могу."
    return "".join(b.text for b in response.content if b.type == "text")


# ---------- общее ----------

def reset(user_id: int) -> None:
    _history.pop(user_id, None)


async def ask(user_id: int, text: str) -> str:
    """Отправляет сообщение в выбранный ИИ с учётом истории и возвращает ответ."""
    history = _history[user_id]
    history.append({"role": "user", "text": text})
    try:
        if PROVIDER == "anthropic":
            answer = await _ask_claude(history)
        else:
            answer = await _ask_gemini(history)
    except AIError as e:
        history.pop()
        msg = str(e)
        return msg if msg.startswith("⏳") else f"⚠️ {msg}"
    except Exception:
        # защита от падения на сцене: сеть, неожиданный ответ и т.п.
        history.pop()
        return "📡 ИИ сейчас недоступен — проверь интернет и попробуй ещё раз."

    answer = answer.strip() or "🤔 Пустой ответ, попробуй переформулировать."
    history.append({"role": "assistant", "text": answer})
    del history[:-MAX_HISTORY]
    return answer
