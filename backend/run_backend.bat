@echo off
title RetinaScreen FastAPI Backend
cd /d "%~dp0"
echo ============================================================
echo   Starting RetinaScreen FastAPI Backend Server (Port 8000)
echo ============================================================
if exist .venv\Scripts\python.exe (
    .venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
) else (
    python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
)
pause
