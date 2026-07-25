import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { api, auth } from '../api';
import Navbar from '../components/Navbar';

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getColor = (p) =>
    p === 'Fake' ? '#e74c3c' : p === 'Real' ? '#2ecc71' : '#95a5a6';

  const getRiskLevel = (prediction, confidence) => {
    if (prediction === 'Real' && confidence > 80) return { label: 'LOW RISK', color: '#2ecc71' };
    if (prediction === 'Fake' && confidence > 80) return { label: 'HIGH RISK', color: '#e74c3c' };
    if (confidence > 60) return { label: 'MEDIUM RISK', color: '#f39c12' };
    return { label: 'UNCERTAIN', color: '#95a5a6' };
  };

  const handleAnalyze = async () => {
    if (!inputValue.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await api.analyze(inputValue);
      setTimeout(() => {
        setResult(data);
        setLoading(false);
      }, 400);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!result) return;
    const doc = new jsPDF();
    const user = auth.getUser();

    doc.setFontSize(18);
    doc.text('AI Fake News Detector — Report', 20, 20);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated for: ${user?.name || 'User'}`, 20, 30);
    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 36);

    doc.setDrawColor(200);
    doc.line(20, 42, 190, 42);

    doc.setTextColor(0);
    doc.setFontSize(14);
    doc.text(`Verdict: ${result.prediction}`, 20, 54);
    doc.text(`Confidence: ${result.confidence}%`, 20, 62);

    const risk = getRiskLevel(result.prediction, result.confidence);
    doc.text(`Risk Level: ${risk.label}`, 20, 70);

    doc.setFontSize(12);
    doc.text('Input:', 20, 84);
    const lines = doc.splitTextToSize(inputValue.substring(0, 800), 170);
    doc.text(lines, 20, 92);

    if (result.highlights && result.highlights.length) {
      const y = 92 + lines.length * 6 + 10;
      doc.text('Key Phrases (LIME):', 20, y);
      doc.text(result.highlights.join(', '), 20, y + 8);
    }

    doc.save(`fake-news-report-${Date.now()}.pdf`);
  };

  return (
    <div className="page" data-theme="analyze">
      <Navbar />
      <div className="container">
        <h1 className="page-title">Verify News Authenticity</h1>
        <p className="page-subtitle">
          Paste a news article — our AI will analyze it for misinformation.
        </p>

        <textarea
          className="news-input"
          rows="6"
          placeholder="Paste an article, claim, or news sentence here..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />

        <button className="analyze-btn" onClick={handleAnalyze} disabled={loading}>
          {loading ? <span className="loading-text">Analyzing using AI...</span> : 'Verify Authenticity'}
        </button>

        {error && <div className="error-box">{error}</div>}

        {result && (
          <div className={`result-card result-${result.prediction.toLowerCase()}`}>
            <div className="result-header">
              <h2>Verdict: <span style={{ color: getColor(result.prediction) }}>{result.prediction}</span></h2>
              <span
                className="risk-badge"
                style={{ backgroundColor: getRiskLevel(result.prediction, result.confidence).color }}
              >
                {getRiskLevel(result.prediction, result.confidence).label}
              </span>
            </div>

            <div className="confidence-section">
              <strong>Confidence Score: </strong>
              <span>{result.confidence}%</span>
              <div className="progress-bg">
                <div
                  className="progress-bar"
                  style={{
                    width: `${result.confidence}%`,
                    backgroundColor: getColor(result.prediction)
                  }}
                />
              </div>
            </div>

            {result.explanation && (
              <div className="explanation-block">
                <strong>AI Explanation:</strong>
                <p
                  className="explanation-text"
                  dangerouslySetInnerHTML={{
                    __html: result.explanation.replace(
                      /\*\*(.+?)\*\*/g,
                      '<strong>$1</strong>'
                    ),
                  }}
                />
              </div>
            )}

            {result.supporting && result.supporting.length > 0 && (
              <div className="highlights-section">
                <strong>Words supporting this verdict:</strong>
                <div className="pills">
                  {result.supporting.map((h, i) => (
                    <span key={i} className="highlight-pill pill-support">{h}</span>
                  ))}
                </div>
              </div>
            )}

            {result.opposing && result.opposing.length > 0 && (
              <div className="highlights-section">
                <strong>Words pointing the other way:</strong>
                <div className="pills">
                  {result.opposing.map((h, i) => (
                    <span key={i} className="highlight-pill pill-oppose">{h}</span>
                  ))}
                </div>
              </div>
            )}

            <button className="download-btn" onClick={downloadPDF}>
              Download PDF Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
