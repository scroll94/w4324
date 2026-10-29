import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // относительные пути, чтобы сайт открывался на GitHub Pages: scroll94.github.io/w4324/site/
  base: './',
  build: { outDir: '../site', emptyOutDir: true },
  server: {
    port: 5173,
    // запросы /api/* уходят на Python-сервер с ИИ (bot/web.py)
    proxy: { '/api': 'http://localhost:8000' },
  },
})
