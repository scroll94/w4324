@echo off
chcp 65001 >nul
cd /d "%~dp0"
start "AI server" cmd /k "cd bot && .venv\Scripts\python web.py"
start "Dashboard" cmd /k "cd dashboard && npm run dev"
timeout /t 3 >nul
start http://localhost:5173
