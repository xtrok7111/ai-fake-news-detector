# AI Fake News Detector

Detection and Classification of Misinformation Using Artificial Intelligence

Bachelor of Science in Computer Science, December 2025
Prince Sattam Bin Abdulaziz University, College of Computer Engineering and Sciences

Supervisor: Dr. Bader Mattar Alotaibi

Team:
- Turki Ali Mubarak Alrayeh
- Bader Ahmed Alghamdi
- Turki Mohammed Alsaiari

## Overview

A full-stack application that classifies English news articles as Real or Fake and
explains why it made each decision. It combines a machine-learning model
(TF-IDF + Logistic Regression) with LIME to highlight the words that drove the
prediction. The project ships as a web app, a REST API, and a Chrome extension.

## Project Structure

```
ai-fake-news-detector/
├── START.bat                          One-click launcher (starts backend + frontend)
│
├── backend/                           Flask REST API + ML model
│   ├── app.py                         6 API endpoints + JWT authentication
│   ├── model_pipeline.py              Text preprocessing + prediction + LIME
│   ├── database.py                    SQLite schema (Users, History, Model_Info)
│   ├── train_model.py                 Trains and saves the model
│   ├── requirements.txt               Python dependencies
│   ├── fake_news_model.pkl            Pre-trained model (ready to run)
│   └── run_backend.bat                Starts the backend (auto-setup on first run)
│
├── frontend/                          React web application
│   ├── src/
│   │   ├── pages/                     Login, Register, Home, Dashboard, ModelInfo, About
│   │   ├── components/                Reusable UI components (Navbar)
│   │   ├── api.js                     Backend API client
│   │   ├── App.js                     Routes + auth guards
│   │   └── index.js                   React entry point
│   ├── package.json                   Node.js dependencies
│   ├── public/                        Static assets
│   └── run_frontend.bat               Starts the frontend (auto-setup on first run)
│
└── extension/                         Chrome extension (Manifest V3)
    ├── manifest.json                  Extension configuration
    ├── popup.html / popup.js / popup.css   Popup UI + analysis interface
    ├── content.js                     Extracts article text from a page
    └── background.js                  Service worker
```

Note: the training datasets (`Fake.csv`, `True.csv`) and `node_modules/` / `venv/`
are not included in the repository because of their size. See
[Training the model](#training-the-model-optional) for the dataset download link.
The app works out of the box using the pre-trained `fake_news_model.pkl`.

## Quick Start (one click)

Double-click `START.bat` in the project folder. It opens two windows: the backend
(http://localhost:5000) and the frontend (http://localhost:3000), installing
dependencies automatically on the first run.

Prefer to run things manually? Follow the steps below.

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Backend

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Server runs at http://localhost:5000.
(The database is created automatically on first start.)

### 2. Frontend

```powershell
cd frontend
npm install
npm start
```

Open http://localhost:3000, register, and analyze.

### 3. Chrome Extension (optional)

1. Open Chrome and go to `chrome://extensions`
2. Turn on Developer mode
3. Click Load unpacked and select the `extension/` folder
4. Click the icon, sign in, and paste any news article to verify it.

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/API/REGISTER` | No | Create a new account |
| POST | `/API/LOGIN` | No | Sign in, returns a JWT |
| POST | `/API/ANALYZE` | Yes | Classify an article + LIME explanation |
| GET | `/API/HISTORY/<user_id>` | Yes | Last 50 analyses for the user |
| POST | `/API/CLEAR_HISTORY` | Yes | Delete the user's history |
| GET | `/API/MODEL-INFO` | No | Model version, accuracy, algorithm |

## Model Details

- Algorithm: TF-IDF + Logistic Regression (scikit-learn pipeline)
- Dataset: Kaggle "Fake and Real News Dataset" (`Fake.csv` = fake, `True.csv` = real)
- Features: up to 15,000 TF-IDF features, unigrams + bigrams, sublinear term frequency
- Preprocessing: lowercasing, URL / punctuation / digit removal, English stopword
  removal, and lemmatization (NLTK)
- Explainability: LIME (Local Interpretable Model-agnostic Explanations)
- Test accuracy: printed after training (around 99% on this dataset)

## Training the model (optional)

A pre-trained `fake_news_model.pkl` is already included, so this step is only needed
if you want to retrain from scratch.

1. Download the dataset from Kaggle:
   https://www.kaggle.com/datasets/clmentbisaillon/fake-and-real-news-dataset
2. Place `Fake.csv` and `True.csv` inside the `backend/` folder.
3. Run:
   ```powershell
   cd backend
   python train_model.py
   ```
   This trains the model, prints accuracy, saves `fake_news_model.pkl`, and records
   the run in the database. Restart the backend afterwards.

## Demo Script

1. Register an account and sign in.
2. Paste this Real sample and click Verify:
   ```
   WASHINGTON (Reuters) - The U.S. Senate on Thursday approved a bipartisan bill
   aimed at funding infrastructure projects across several states, according to
   officials familiar with the vote. The measure now moves to the House for review.
   ```
3. Paste this Fake sample and click Verify:
   ```
   SHOCKING!!! Doctors discover a miracle cure that big pharma is desperately
   hiding from you! Drink this simple home remedy and cure every disease overnight.
   Share before they delete this!!!
   ```
4. Open the result to see the verdict, confidence, and the words LIME highlighted.
5. Open the Dashboard to see history and statistics.
6. Open Model Info to see the algorithm, accuracy, and explainability method.
7. Show the Chrome extension analyzing a live news page.

## Tech Stack

Backend: Python, Flask, scikit-learn, NLTK, LIME, SQLite, JWT, joblib
Frontend: React, React Router, jsPDF
Extension: Chrome Manifest V3 (service worker + content script)
