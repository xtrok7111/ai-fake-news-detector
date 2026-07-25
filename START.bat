@echo off
title AI Fake News App - Launcher
echo ============================================
echo         AI FAKE NEWS APP
echo ============================================
echo.
echo Opening the backend and frontend in two windows...
echo.

start "AI Fake News - Backend"  cmd /k "%~dp0backend\run_backend.bat"
start "AI Fake News - Frontend" cmd /k "%~dp0frontend\run_frontend.bat"

echo Done.
echo   Backend  -^> http://localhost:5000
echo   Frontend -^> http://localhost:3000  (opens in your browser)
echo.
echo You can close this window.
pause
