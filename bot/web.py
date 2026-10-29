"""Мини-сервер для чата на сайте: POST /api/chat {"message": "..."} -> {"answer": "..."}

Запуск: .venv\\Scripts\\python web.py   (порт 8000)
"""
from aiohttp import web

import ai

WEB_USER_ID = -1  # пока один общий диалог для сайта


async def chat(request: web.Request) -> web.Response:
    try:
        data = await request.json()
        text = str(data.get("message", "")).strip()
    except Exception:
        return web.json_response({"answer": "⚠️ Неверный запрос"}, status=400)
    if not text:
        return web.json_response({"answer": "Напиши что-нибудь 🙂"})
    return web.json_response({"answer": await ai.ask(WEB_USER_ID, text)})


app = web.Application()
app.router.add_post("/api/chat", chat)

if __name__ == "__main__":
    web.run_app(app, host="127.0.0.1", port=8000)
