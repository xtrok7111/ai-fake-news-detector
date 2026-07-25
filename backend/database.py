"""
SQLite schema for the AI Fake News Detector.

Creates three tables on startup: USERS (accounts), HISTORY (past
analyses) and MODEL_INFO (trained-model metadata).
"""

import sqlite3


def init_db():
    """Create the database tables if they do not already exist."""
    conn = sqlite3.connect('fakenews.db')
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS USERS (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            password_hash TEXT
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS HISTORY (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            input_text TEXT,
            prediction TEXT,
            confidence REAL,
            date TEXT,
            FOREIGN KEY(user_id) REFERENCES USERS(id)
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS MODEL_INFO (
            model_id INTEGER PRIMARY KEY AUTOINCREMENT,
            version TEXT,
            accuracy REAL,
            date_trained TEXT
        )
    ''')

    conn.commit()
    conn.close()


if __name__ == '__main__':
    init_db()
    print("Database initialized successfully.")
