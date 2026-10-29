@echo off
chcp 65001 >nul
cd /d "%~dp0bot"
.venv\Scripts\python bot.py
pause
