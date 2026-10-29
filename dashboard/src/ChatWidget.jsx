import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bot, Send, Sparkles, X } from 'lucide-react'

// Чат с тем же ИИ, что и в Telegram-боте (через bot/web.py)
export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Привет! Я ваш ИИ-ассистент. Спросите что угодно о ваших данных 👋' },
  ])
  const bottom = useRef(null)

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', text }])
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })
      const data = await res.json()
      setMessages((m) => [...m, { role: 'assistant', text: data.answer }])
    } catch {
      setMessages((m) => [...m, { role: 'assistant', text: '📡 ИИ-сервер не запущен. Запусти bot/web.py' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 shadow-lg shadow-indigo-500/30"
      >
        {open ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="glass fixed bottom-24 right-4 z-50 flex h-[520px] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-3xl shadow-2xl sm:right-6"
          >
            <div className="flex items-center gap-3 border-b border-white/5 px-5 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20">
                <Bot className="h-5 w-5 text-indigo-300" />
              </div>
              <div>
                <p className="text-sm font-semibold">ИИ-ассистент</p>
                <p className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> онлайн
                </p>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm ${
                    m.role === 'user'
                      ? 'ml-auto bg-indigo-500 text-white'
                      : 'bg-white/5 text-slate-200'
                  }`}
                >
                  {m.text}
                </motion.div>
              ))}
              {loading && (
                <div className="flex w-16 gap-1 rounded-2xl bg-white/5 px-4 py-3">
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      className="h-2 w-2 rounded-full bg-slate-400"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay: d * 0.15 }}
                    />
                  ))}
                </div>
              )}
              <div ref={bottom} />
            </div>

            <form onSubmit={send} className="flex gap-2 border-t border-white/5 p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Напишите сообщение…"
                className="flex-1 rounded-xl bg-white/5 px-4 py-2.5 text-sm outline-none placeholder:text-slate-500 focus:ring-1 focus:ring-indigo-400"
              />
              <button className="rounded-xl bg-indigo-500 px-3 transition hover:bg-indigo-400 disabled:opacity-50" disabled={loading}>
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
