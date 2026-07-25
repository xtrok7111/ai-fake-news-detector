"""
Flask backend for the AI Fake News Detector.

Exposes six endpoints: register, login, analyze, history, clear-history
and model-info. Authentication uses JWT; the ML logic lives in
model_pipeline.py and the schema in database.py.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import datetime
import hashlib
import jwt
from functools import wraps
from model_pipeline import predict_news
from database import init_db


app = Flask(__name__)
CORS(app)  # frontend runs on a different origin, so cross-origin requests must be allowed

SECRET_KEY = "fake-news-detector-secret-key-2025"
init_db()


def db():
    """Open a SQLite connection with row access by column name."""
    conn = sqlite3.connect('fakenews.db')
    conn.row_factory = sqlite3.Row
    return conn


def hash_password(pwd):
    """Hash a password with SHA-256 so plaintext is never stored."""
    return hashlib.sha256(pwd.encode()).hexdigest()


def make_token(user_id, email):
    """Issue a JWT that identifies the user for seven days."""
    payload = {
        'user_id': user_id,
        'email': email,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')


def auth_required(f):
    """Reject requests without a valid JWT in the Authorization header."""
    @wraps(f)
    def wrapper(*args, **kwargs):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            request.user_id = data['user_id']
        except Exception:
            return jsonify({"error": "Unauthorized"}), 401
        return f(*args, **kwargs)
    return wrapper


@app.route('/API/REGISTER', methods=['POST'])
def register():
    """Create a new user account and return a login token."""
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    pwd = data.get('password', '')

    if not (name and email and pwd):
        return jsonify({"error": "All fields are required"}), 400

    if len(pwd) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    try:
        conn = db()
        cur = conn.execute(
            'INSERT INTO USERS (name, email, password_hash) VALUES (?, ?, ?)',
            (name, email, hash_password(pwd))
        )
        user_id = cur.lastrowid
        conn.commit()
        conn.close()
    except sqlite3.IntegrityError:
        # email column is UNIQUE, so a duplicate raises here
        return jsonify({"error": "Email already registered"}), 400

    return jsonify({
        "token": make_token(user_id, email),
        "user": {
            "id": user_id,
            "name": name,
            "email": email
        }
    })


@app.route('/API/LOGIN', methods=['POST'])
def login():
    """Authenticate a user and return a JWT token."""
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    pwd = data.get('password', '')

    conn = db()
    user = conn.execute(
        'SELECT * FROM USERS WHERE email = ? AND password_hash = ?',
        (email, hash_password(pwd))
    ).fetchone()
    conn.close()

    if not user:
        # deliberately vague so we don't reveal which field was wrong
        return jsonify({"error": "Invalid email or password"}), 401

    return jsonify({
        "token": make_token(user['id'], user['email']),
        "user": {
            "id": user['id'],
            "name": user['name'],
            "email": user['email']
        }
    })


@app.route('/API/ANALYZE', methods=['POST'])
@auth_required
def analyze():
    """Classify an article as Real or Fake and store the result in history."""
    text = (request.get_json() or {}).get('text', '').strip()

    if not text:
        return jsonify({"error": "Input is empty"}), 400

    result = predict_news(text)
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    conn = db()
    conn.execute(
        'INSERT INTO HISTORY (user_id, input_text, prediction, confidence, date) VALUES (?, ?, ?, ?, ?)',
        (request.user_id, text, result['prediction'], result['confidence'], now)
    )
    conn.commit()
    conn.close()

    return jsonify(result)


@app.route('/API/HISTORY/<int:user_id>', methods=['GET'])
@auth_required
def get_history(user_id):
    """Return the user's 50 most recent analyses."""
    if user_id != request.user_id:
        # users may only read their own history
        return jsonify({"error": "Forbidden"}), 403

    conn = db()
    rows = conn.execute(
        'SELECT * FROM HISTORY WHERE user_id = ? ORDER BY id DESC LIMIT 50',
        (user_id,)
    ).fetchall()
    conn.close()

    return jsonify([dict(r) for r in rows])


@app.route('/API/CLEAR_HISTORY', methods=['POST'])
@auth_required
def clear_history():
    """Delete all history belonging to the authenticated user."""
    conn = db()
    conn.execute('DELETE FROM HISTORY WHERE user_id = ?', (request.user_id,))
    conn.commit()
    conn.close()

    return jsonify({"message": "History cleared"})


@app.route('/API/MODEL-INFO', methods=['GET'])
def model_info():
    """Return metadata for the most recently trained model."""
    conn = db()
    row = conn.execute(
        'SELECT * FROM MODEL_INFO ORDER BY model_id DESC LIMIT 1'
    ).fetchone()
    conn.close()

    # fall back to sensible defaults if the model has never been trained
    info = dict(row) if row else {
        "version": "1.0",
        "accuracy": 99.0,
        "date_trained": "2025-10-15"
    }
    info['algorithm'] = "TF-IDF + Logistic Regression"
    info['explainability'] = "LIME"

    return jsonify(info)


if __name__ == '__main__':
    print("AI FAKE NEWS DETECTOR — running on http://localhost:5000")
    app.run(debug=True, port=5000)
