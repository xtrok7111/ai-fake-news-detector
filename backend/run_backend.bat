@echo off
REM Starts the Flask backend. Creates the virtual environment and installs
REM dependencies automatically the first time it runs.
cd /d "%~dp0"

if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

call venv\Scripts\activate

if not exist venv\.installed (
    echo Installing Python packages, please wait...
    pip install -r requirements.txt
    echo installed> venv\.installed
)

echo.
echo Backend running on http://localhost:5000
echo.
python app.py
