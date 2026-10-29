"""Telegram-бот с ИИ (Gemini или Claude — см. AI_PROVIDER в .env).

Запуск:            .venv\\Scripts\\python bot.py
Проверка без TG:   .venv\\Scripts\\python bot.py --cli
"""
import asyncio
import logging
import os
import sys

from aiogram import Bot, Dispatcher, F
from aiogram.enums import ChatAction
from aiogram.filters import Command, CommandStart
from aiogram.types import Message
from dotenv import load_dotenv

import ai

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

dp = Dispatcher()


@dp.message(CommandStart())
async def on_start(message: Message) -> None:
    ai.reset(message.from_user.id)
    await message.answer(
        f"Привет, {message.from_user.first_name}! 👋\n"
        "Я ИИ-ассистент. Задай любой вопрос.\n\n"
        "/new — начать диалог заново"
    )


@dp.message(Command("new"))
async def on_new(message: Message) -> None:
    ai.reset(message.from_user.id)
    await message.answer("🧹 История очищена, начинаем заново.")


@dp.message(F.text)
async def on_text(message: Message, bot: Bot) -> None:
    await bot.send_chat_action(message.chat.id, ChatAction.TYPING)
    answer = await ai.ask(message.from_user.id, message.text)
    # у Telegram лимит 4096 символов на сообщение
    for i in range(0, len(answer), 4000):
        await message.answer(answer[i : i + 4000])


async def run_cli() -> None:
    print("Чат с ИИ в консоли. Выход — Ctrl+C\n")
    while True:
        text = input("Ты: ").strip()
        if text:
            print("Бот:", await ai.ask(0, text), "\n")


async def main() -> None:
    token = os.getenv("TELEGRAM_BOT_TOKEN", "").strip()
    if not token:
        sys.exit("TELEGRAM_BOT_TOKEN пустой — вставь токен от @BotFather в файл bot/.env")
    bot = Bot(token)
    me = await bot.get_me()
    logging.info("Бот запущен: https://t.me/%s", me.username)
    await dp.start_polling(bot)


if __name__ == "__main__":
    try:
        asyncio.run(run_cli() if "--cli" in sys.argv else main())
    except (KeyboardInterrupt, EOFError):
        pass
