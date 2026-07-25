"""
Prediction pipeline for the AI Fake News Detector.

Loads the trained TF-IDF + Logistic Regression model, cleans incoming
text the same way it was cleaned during training, and uses LIME to
surface the words that drove each prediction.
"""

import re
import string
import os
import joblib
from lime.lime_text import LimeTextExplainer


# NLTK provides stopword removal and lemmatization. If it fails to load we
# fall back to basic cleaning so the model still works.
try:
    import nltk
    from nltk.stem import WordNetLemmatizer
    from nltk.corpus import stopwords

    for pkg in ['wordnet', 'omw-1.4', 'stopwords']:
        try:
            nltk.data.find(f'corpora/{pkg}')
        except LookupError:
            nltk.download(pkg, quiet=True)

    _lemmatizer = WordNetLemmatizer()
    _stopwords = set(stopwords.words('english'))  # set gives O(1) membership tests

except Exception:
    _lemmatizer = None
    _stopwords = set()


def preprocess_text(text):
    """
    Clean and normalize text before prediction.

    Must match the preprocessing used at training time, otherwise the
    features drift and accuracy drops.
    """
    if not text:
        return ""

    text = text.lower()
    text = re.sub(r'http\S+|www\.\S+', ' ', text)                       # drop URLs
    text = re.sub(f"[{re.escape(string.punctuation)}]", " ", text)      # drop punctuation
    text = re.sub(r'\d+', ' ', text)                                    # drop digits

    tokens = [t for t in text.split() if t not in _stopwords and len(t) > 2]

    if _lemmatizer:
        tokens = [_lemmatizer.lemmatize(t) for t in tokens]

    return " ".join(tokens)


# Load the trained pipeline once at import time. Training is slow, so the
# model is trained separately (train_model.py) and only loaded here.
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'fake_news_model.pkl')

if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
    vectorizer = model.named_steps['tfidfvectorizer']
else:
    print(f"WARN: {MODEL_PATH} not found. Run train_model.py first.")
    model = None
    vectorizer = None

# class order must match the training labels: 0 = Fake, 1 = Real
lime_explainer = LimeTextExplainer(class_names=['Fake', 'Real'])


def _explain(prediction, confidence, supporting, opposing):
    """Turn the prediction and its key words into a readable sentence."""
    if prediction == "Unverified":
        return "Text too short. Please paste a longer article."

    if confidence >= 90:
        level = "very confident"
    elif confidence >= 75:
        level = "fairly confident"
    elif confidence >= 60:
        level = "moderately confident"
    else:
        level = "uncertain"

    s = f"The model classified this article as {prediction.upper()} and is {level} ({confidence}%)."

    if supporting:
        words = ", ".join(f'"{w}"' for w in supporting[:5])
        kind = "formal news writing" if prediction == "Real" else "sensational or misleading language"
        s += f" The strongest signals are the words {words}, which are typical of {kind}."

    if opposing:
        opposing_words = ', '.join(opposing[:3])
        s += f" Some words like {opposing_words} pointed the other way, lowering confidence."

    return s


def predict_news(user_text):
    """
    Classify news as Real or Fake and explain the decision.

    Returns the prediction, a confidence percentage, the supporting and
    opposing words from LIME, and a natural-language explanation.
    """
    if model is None:
        return {
            "prediction": "Error",
            "confidence": 0,
            "highlights": [],
            "supporting": [],
            "opposing": [],
            "explanation": "Model not loaded."
        }

    cleaned = preprocess_text(user_text)

    # nnz == 0 means none of the words are in the model's vocabulary, so
    # there is nothing meaningful to classify.
    if vectorizer.transform([cleaned]).nnz == 0:
        return {
            "prediction": "Unverified",
            "confidence": 0,
            "highlights": [],
            "supporting": [],
            "opposing": [],
            "explanation": _explain("Unverified", 0, [], [])
        }

    probs = model.predict_proba([cleaned])[0]  # [P(Fake), P(Real)]
    is_real = probs[1] > 0.5
    prediction = "Real" if is_real else "Fake"
    confidence = round(max(probs) * 100, 2)

    supporting = []
    opposing = []

    try:
        # LIME returns the top words with a weight: positive pushes toward
        # Real, negative toward Fake. A word "supports" the prediction when
        # its direction agrees with the final decision.
        for word, weight in lime_explainer.explain_instance(
                cleaned, model.predict_proba, num_features=8).as_list():
            push_real = weight > 0
            if push_real == is_real:
                supporting.append(word)
            else:
                opposing.append(word)
    except Exception:
        # explanation is optional; never fail the prediction because LIME did
        pass

    return {
        "prediction": prediction,
        "confidence": confidence,
        "highlights": supporting[:6],
        "supporting": supporting[:6],
        "opposing": opposing[:4],
        "explanation": _explain(prediction, confidence, supporting, opposing),
    }
