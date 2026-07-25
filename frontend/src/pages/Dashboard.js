import React, { useEffect, useState } from 'react';
import { api, auth } from '../api';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.getUser();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const h = await api.history(user.id);
      setHistory(h);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (!window.confirm('Clear all your verification history?')) return;
    await api.clearHistory();
    load();
  };

  const total = history.length;
  const fake = history.filter(h => h.prediction === 'Fake').length;
  const real = history.filter(h => h.prediction === 'Real').length;

  const getColor = (p) =>
    p === 'Fake' ? '#e74c3c' : p === 'Real' ? '#2ecc71' : '#95a5a6';

  const snippet = (t) => {
    if (!t) return '';
    return t.length > 60 ? t.substring(0, 60) + '...' : t;
  };

  return (
    <div className="page" data-theme="dashboard">
      <Navbar />
      <div className="container">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome back, {user?.name}.</p>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-num">{total}</div>
                <div className="stat-label">Total Checks</div>
              </div>
              <div className="stat-card stat-real">
                <div className="stat-num">{real}</div>
                <div className="stat-label">Real News</div>
              </div>
              <div className="stat-card stat-fake">
                <div className="stat-num">{fake}</div>
                <div className="stat-label">Fake News</div>
              </div>
            </div>

            <div className="history-section">
              <div className="history-header">
                <h3>Verification History</h3>
                {history.length > 0 && (
                  <button className="clear-btn" onClick={handleClear}>
                    Clear History
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <p className="empty-state">No verifications yet. Try analyzing a news article!</p>
              ) : (
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Input</th>
                      <th>Verdict</th>
                      <th>Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h) => (
                      <tr key={h.id}>
                        <td className="date-cell">{h.date}</td>
                        <td className="snippet-cell">"{snippet(h.input_text)}"</td>
                        <td style={{ color: getColor(h.prediction), fontWeight: 'bold' }}>
                          {h.prediction}
                        </td>
                        <td>{h.confidence}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
