// Облачный ИИ-чат для онлайн-версии сайта (Cloudflare Workers).
// POST {"message": "...", "history": [{role, text}]} -> {"answer": "..."}
// Ключ Gemini хранится в секрете GEMINI_API_KEY, в коде его нет.
import prompt from '../../bot/prompt.txt'
import data from '../../dashboard/src/data.json'

const SYSTEM_PROMPT = `${prompt.trim()}\n\nДАННЫЕ:\n${JSON.stringify(data)}`
const MAX_HISTORY = 20
const ALLOWED_ORIGINS = ['https://scroll94.github.io', 'http://localhost:5173']

function cors(origin) {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

function reply(answer, origin, status = 200) {
  return Response.json({ answer }, { status, headers: cors(origin) })
}

async function askGemini(env, history) {
  const model = env.GEMINI_MODEL || 'gemini-3.1-flash-lite'
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: history.map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.text }],
        })),
      }),
      signal: AbortSignal.timeout(40_000),
    },
  )
  if (res.status === 429) return '⏳ Лимит бесплатных запросов Gemini, подожди минуту.'
  if (res.status === 503 || res.status === 504) return '⏳ Gemini сейчас перегружен, попробуй ещё раз через пару секунд.'
  if (!res.ok) return `⚠️ Ошибка Gemini (${res.status}). Попробуй ещё раз.`
  const json = await res.json()
  const text = (json.candidates?.[0]?.content?.parts ?? []).map((p) => p.text ?? '').join('').trim()
  return text || '🤔 Пустой ответ, попробуй переформулировать.'
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || ''
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors(origin) })
    if (request.method !== 'POST') return reply('Используй POST', origin, 405)
    if (!env.GEMINI_API_KEY) return reply('⚠️ На сервере не задан GEMINI_API_KEY', origin, 500)

    let body
    try {
      body = await request.json()
    } catch {
      return reply('⚠️ Неверный запрос', origin, 400)
    }
    const message = String(body.message ?? '').trim().slice(0, 4000)
    if (!message) return reply('Напиши что-нибудь 🙂', origin)

    const history = (Array.isArray(body.history) ? body.history : [])
      .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.text === 'string')
      .slice(-MAX_HISTORY)
      .map((m) => ({ role: m.role, text: m.text.slice(0, 4000) }))
    history.push({ role: 'user', text: message })
    // Gemini требует, чтобы диалог начинался с пользователя
    while (history.length && history[0].role !== 'user') history.shift()

    try {
      return reply(await askGemini(env, history), origin)
    } catch {
      return reply('📡 ИИ сейчас недоступен, попробуй ещё раз.', origin)
    }
  },
}
