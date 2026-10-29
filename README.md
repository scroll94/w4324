# Ctrl+C Ctrl+V — фронтенд и ИИ-бот (часть Scroll)

```
dashboard/   сайт-дашборд: React + Vite + Tailwind + Recharts + Framer Motion
bot/         ИИ (Gemini или Claude): Telegram-бот (bot.py) и сервер чата для сайта (web.py)
```

**Онлайн-версия дашборда:** https://scroll94.github.io/w4324/site/ (ИИ-чат работает только в локальной версии и в Telegram-боте @scroll00Bot)

Обновить онлайн-версию: `npm --prefix dashboard run build` → закоммитить папку `site/` → `git push`.

## 1. Вставь ключи

Открой `bot/.env` и заполни:

| Строка | Где взять |
|---|---|
| `GEMINI_API_KEY=` | Бесплатно: https://aistudio.google.com → **Get API key** (или ключ от nigoday) |
| `TELEGRAM_BOT_TOKEN=` | В Telegram напиши **@BotFather** → `/newbot` → придумай имя → скопируй токен |

### Переключиться на Claude
1. Получи ключ: https://console.anthropic.com → **API Keys** → **Create Key** (нужно пополнить баланс в **Billing**, подписка Claude Pro к API не относится)
2. В `bot/.env` вставь его в `ANTHROPIC_API_KEY=` и поменяй `AI_PROVIDER=gemini` на `AI_PROVIDER=anthropic`
3. Перезапусти бота и сайт. Код менять не нужно.

`.env` уже в `.gitignore`: в GitHub ключи не попадут.

## 2. Запуск

- **Сайт с ИИ-чатом:** двойной клик по `start-site.bat` → откроется http://localhost:5173 (кнопка ✨ справа внизу — чат)
- **Telegram-бот:** двойной клик по `start-bot.bat` (запускается в фоне, без окна, лог в `bot/bot.log`)
  - `bot-autostart-on.bat` — бот сам стартует при включении ПК
  - `bot-autostart-off.bat` — убрать из автозапуска
  - `bot-stop.bat` — остановить бота
- **Проверить ИИ без Telegram:** `cd bot` → `.venv\Scripts\python bot.py --cli`

## 3. Что менять под кейс

- `bot/ai.py` → `SYSTEM_PROMPT` — роль и поведение ИИ под задачу хакатона
- `dashboard/src/data.js` — демо-данные (заменить на базу от Егора / API Орика)
- `dashboard/src/App.jsx` — карточки, графики, таблица
