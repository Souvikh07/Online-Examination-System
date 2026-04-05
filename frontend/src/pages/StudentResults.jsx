import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client.js';

export default function StudentResults() {
  const [attempts, setAttempts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get('/attempts/mine');
        if (!cancelled) setAttempts(data);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="loading-state">Loading results…</div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="page-header">
        <h1>My results</h1>
        <p className="page-header__subtitle">Scores from exams you have already submitted.</p>
      </header>
      {error && <p className="error">{error}</p>}
      {!attempts.length && !error && (
        <div className="empty-state">
          <p className="mb-0">No completed exams yet. Finish a test to see it here.</p>
        </div>
      )}
      <div className="exam-grid">
        {attempts.map((a) => (
          <article key={a._id} className="exam-card">
            <h2>{a.exam?.title || 'Exam'}</h2>
            <p className="exam-card__desc text-muted">
              {a.submittedAt ? new Date(a.submittedAt).toLocaleString() : ''}
            </p>
            <p style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0.25rem 0 0' }}>
              {a.score} / {a.totalQuestions}
            </p>
            <div className="exam-card__footer">
              <Link to={`/student/result/${a._id}`} className="btn secondary">
                View breakdown
              </Link>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-1">
        <Link to="/student" className="link-back">
          ← All exams
        </Link>
      </p>
    </div>
  );
}
