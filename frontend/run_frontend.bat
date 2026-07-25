@echo off
REM Starts the React frontend. Installs Node packages automatically the
REM first time it runs.
cd /d "%~dp0"

if not exist node_modules (
    echo Installing Node packages, this may take a few minutes...
    call npm install
)

echo.
echo Frontend starting on http://localhost:3000
echo.
call npm start
