# AI Fake News Detector — Setup Instructions

Quick steps to run the project on a fresh machine.

## Requirements

- **Python 3.10+**  → backend
- **Node.js 18+** and **npm**  → frontend
- **Google Chrome** (optional)  → browser extension

> The zip excludes `backend/venv/`, `backend/__pycache__/`, and `frontend/node_modules/` because they are very large and platform-specific. You will recreate them with the commands below.

---

## 1. Backend (Flask + ML)

Open a terminal inside the `backend/` folder:

```bash
cd backend

# Create a virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS / Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# (Optional) Re-train the model from the CSVs — only if you want to.
# A pre-trained model fake_news_model.pkl is already included, so you can skip this.
python train_model.py

# Run the Flask API
python app.py
```

The backend runs on **http://localhost:5000**.

---

## 2. Frontend (React)

Open a **new** terminal inside `frontend/`:

```bash
cd frontend
npm install
npm start
```

The frontend opens at **http://localhost:3000**.

---

## 3. Browser Extension (optional)

1. Open Chrome → `chrome://extensions/`
2. Enable **Developer mode** (top-right toggle).
3. Click **Load unpacked** and select the `extension/` folder.

The extension icon appears in the toolbar. Make sure the backend is running first.

---

## What's inside

| Folder / File | Purpose |
|---|---|
| `backend/` | Flask API + ML pipeline + trained model |
| `frontend/` | React web application (Login, Analyse, Dashboard, Model Info, About Us) |
| `extension/` | Chrome extension (Manifest V3) |
| `Presentation.pptx` | Final 15-slide presentation |
| `build_pptx.js` | Script that regenerates `Presentation.pptx` (needs Node.js + pptxgenjs) |
| `Project_Report.docx` | Full final report |

---

## Quick API check

After starting the backend, hit this in your browser to confirm it's alive:

```
http://localhost:5000/API/MODEL-INFO
```

You should see JSON with the model accuracy and metadata.
