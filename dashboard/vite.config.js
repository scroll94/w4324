import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // запросы /api/* уходят на Python-сервер с ИИ (bot/web.py)
    proxy: { '/api': 'http://localhost:8000' },
  },
})
