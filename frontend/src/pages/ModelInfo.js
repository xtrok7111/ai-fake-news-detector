import React, { useEffect, useState } from 'react';
import { api } from '../api';
import Navbar from '../components/Navbar';

export default function ModelInfo() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    api.modelInfo().then(setInfo).catch(console.error);
  }, []);

  return (
    <div className="page" data-theme="model">
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Model Information</h1>
          <p className="page-subtitle">
            Technical details and performance metrics of the AI model.
          </p>
        </div>

        {info && (
          <div className="info-grid stagger">
            <div className="info-card animate-pop">
              <h4>Algorithm</h4>
              <p>{info.algorithm}</p>
            </div>
            <div className="info-card animate-pop">
              <h4>Version</h4>
              <p>{info.version}</p>
            </div>
            <div className="info-card animate-pop highlight-card">
              <h4>Test Accuracy</h4>
              <p className="big-number">{info.accuracy}%</p>
            </div>
            <div className="info-card animate-pop">
              <h4>Date Trained</h4>
              <p>{info.date_trained}</p>
            </div>
            <div className="info-card animate-pop">
              <h4>Explainability</h4>
              <p>{info.explainability}</p>
            </div>
            <div className="info-card animate-pop">
              <h4>Dataset</h4>
              <p>Kaggle Fake & Real News</p>
            </div>
            <div className="info-card animate-pop">
              <h4>Language</h4>
              <p>English</p>
            </div>
            <div className="info-card animate-pop">
              <h4>Model Size</h4>
              <p>~451 KB</p>
            </div>
          </div>
        )}

        <div className="about-section animate-fadein">
          <h3>How It Works</h3>
          <div className="pipeline">
            <div className="pipeline-step">
              <div className="pipeline-num">1</div>
              <div>
                <h4>Input</h4>
                <p>User pastes an English news article.</p>
              </div>
            </div>
            <div className="pipeline-arrow">↓</div>
            <div className="pipeline-step">
              <div className="pipeline-num">2</div>
              <div>
                <h4>Preprocessing</h4>
                <p>Lowercase, text cleaning, English stopwords removal, lemmatization.</p>
              </div>
            </div>
            <div className="pipeline-arrow">↓</div>
            <div className="pipeline-step">
              <div className="pipeline-num">3</div>
              <div>
                <h4>Feature Extraction</h4>
                <p>TF-IDF vectorization with bigrams (20,000 features).</p>
              </div>
            </div>
            <div className="pipeline-arrow">↓</div>
            <div className="pipeline-step">
              <div className="pipeline-num">4</div>
              <div>
                <h4>Classification</h4>
                <p>Logistic Regression predicts Real or Fake.</p>
              </div>
            </div>
            <div className="pipeline-arrow">↓</div>
            <div className="pipeline-step">
              <div className="pipeline-num">5</div>
              <div>
                <h4>Explainability</h4>
                <p>LIME highlights the most influential phrases.</p>
              </div>
            </div>
            <div className="pipeline-arrow">↓</div>
            <div className="pipeline-step">
              <div className="pipeline-num">6</div>
              <div>
                <h4>Result</h4>
                <p>Verdict + confidence + risk level shown to the user.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="about-section animate-fadein">
          <h3>Dataset Details</h3>
          <p>
            Our model is trained on the <strong>Kaggle Fake & Real News Dataset</strong> —
            a widely-used benchmark containing over <strong>44,000 English news articles</strong>,
            balanced across two classes: <em>Real</em> (Reuters-style press wire articles)
            and <em>Fake</em> (articles from unreliable sources).
          </p>
          <p>
            The training script is designed to <strong>combine multiple datasets</strong> for
            improved robustness. Additional CSV datasets (WELFake, LIAR, custom) can be dropped
            into the backend folder and they will be auto-detected and merged.
          </p>
          <p>
            The combined dataset is split 80% training / 20% testing using stratified sampling,
            with TF-IDF feature extraction (15,000 features, bigrams) and Logistic Regression
            classification.
          </p>
        </div>

        <div className="about-section animate-fadein">
          <h3>Security</h3>
          <ul className="how-list">
            <li>SHA-256 password hashing for user accounts.</li>
            <li>JWT (JSON Web Tokens) for stateless authentication (7-day expiration).</li>
            <li>Per-user data isolation enforced at the database layer.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
