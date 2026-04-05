import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client.js';

export default function StudentDashboard() {
  const [exams, setExams] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get('/exams');
        if (!cancelled) setExams(data);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Failed to load exams');
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
        <div className="loading-state">Loading exams…</div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="page-header">
        <h1>Available exams</h1>
        <p className="page-header__subtitle">Choose a published exam to begin. Good luck.</p>
      </header>
      {error && <p className="error">{error}</p>}
      {!exams.length && !error && (
        <div className="empty-state">
          <p className="mb-0">No published exams yet. Check back later.</p>
        </div>
      )}
      <div className="exam-grid">
        {exams.map((exam) => (
          <article key={exam._id} className="exam-card">
            <h2>{exam.title}</h2>
            <p className="exam-card__desc">{exam.description || 'No description provided.'}</p>
            <div className="exam-card__footer">
              <span className="meta-pill">⏱ {exam.durationMinutes} min</span>
              <Link to={`/student/exam/${exam._id}/take`} className="btn">
                Start exam
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
