"""
Train and save the fake-news classifier.

Reads Fake.csv (label 0) and True.csv (label 1), trains a
TF-IDF + Logistic Regression pipeline, reports accuracy, and saves the
model to fake_news_model.pkl for the backend to load.
"""

import time, sqlite3, datetime, joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report


def main():
    print("=" * 60)
    print(" FAKE NEWS DETECTOR  -  MODEL TRAINING")
    print("=" * 60)

    # Load the two datasets and label them
    fake = pd.read_csv('Fake.csv')
    true = pd.read_csv('True.csv')
    fake['label'], true['label'] = 0, 1
    print(f"  Fake.csv: {len(fake):,}  |  True.csv: {len(true):,}")

    # Merge title and body; the title carries strong signals for classification
    df = pd.concat([fake, true], ignore_index=True).fillna('')
    df['input'] = (df['title'] + ' ' + df['text']).astype(str).str.strip()
    df = df[df['input'].str.len() > 30].drop_duplicates(subset=['input'])
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)  # shuffle, fixed seed for reproducibility
    print(f"  Total after cleaning: {len(df):,}")

    # 80/20 split, stratified to keep the class balance in both sets
    X_train, X_test, y_train, y_test = train_test_split(
        df['input'].values, df['label'].values,
        test_size=0.2, random_state=42, stratify=df['label'].values)

    # A pipeline guarantees the same TF-IDF transform is applied at train and
    # predict time, which avoids data leakage.
    model = make_pipeline(
        TfidfVectorizer(
            stop_words='english',
            max_features=15000,
            ngram_range=(1, 2),       # unigrams + bigrams (e.g. "fake news")
            min_df=2,
            sublinear_tf=True),
        LogisticRegression(
            random_state=42,
            max_iter=400,
            C=4.0,                    # lighter regularization; TF-IDF benefits from a higher C
            solver='liblinear'))

    print("\n  Training model...")
    start = time.time()
    model.fit(X_train, y_train)
    print(f"  Done in {round(time.time() - start, 1)}s.")

    # Evaluate on the held-out test set
    acc = accuracy_score(y_test, model.predict(X_test))
    print(f"\n  [Test Accuracy]  {acc * 100:.2f}%\n")
    print(classification_report(y_test, model.predict(X_test),
                                target_names=['Fake', 'Real']))

    joblib.dump(model, 'fake_news_model.pkl')
    print("  Saved -> fake_news_model.pkl")

    # Quick sanity check on two obvious examples
    print("\n  --- Sanity test ---")
    samples = [
        ("WASHINGTON (Reuters) - The U.S. Senate approved a bill on Thursday.", 'Real'),
        ("SHOCKING!!! Doctors discover miracle cure that big pharma is hiding!!!", 'Fake'),
    ]
    for text, expected in samples:
        probs = model.predict_proba([text])[0]
        pred = "Real" if probs[1] > 0.5 else "Fake"
        conf = round(max(probs) * 100, 2)
        ok = "OK   " if pred == expected else "WRONG"
        print(f"   [{ok}] {pred} ({conf:.2f}%)  -  '{text[:50]}...'")

    # Record this run so the /model-info endpoint can display it
    conn = sqlite3.connect('fakenews.db')
    conn.execute('''CREATE TABLE IF NOT EXISTS MODEL_INFO (
        model_id INTEGER PRIMARY KEY AUTOINCREMENT,
        version TEXT, accuracy REAL, date_trained TEXT)''')
    conn.execute(
        'INSERT INTO MODEL_INFO (version, accuracy, date_trained) VALUES (?, ?, ?)',
        ('Fake.csv + True.csv', round(acc * 100, 2),
         datetime.datetime.now().strftime('%Y-%m-%d')))
    conn.commit(); conn.close()

    print(f"\n  [DONE] Restart backend with: python app.py")


if __name__ == '__main__':
    main()
