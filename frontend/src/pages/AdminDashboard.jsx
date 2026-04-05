import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client.js';

export default function AdminDashboard() {
  const [exams, setExams] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/exams');
      setExams(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load exams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    if (!window.confirm('Delete this exam and all its questions?')) return;
    try {
      await api.delete(`/exams/${id}`);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-state">Loading exams…</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="admin-toolbar">
        <header className="page-header" style={{ marginBottom: 0 }}>
          <h1>Your exams</h1>
          <p className="page-header__subtitle">Create tests, add MCQs, then publish when students should see them.</p>
        </header>
        <Link to="/admin/exams/new" className="btn">
          + New exam
        </Link>
      </div>
      {error && <p className="error">{error}</p>}
      {!exams.length && !error && (
        <div className="empty-state">
          <p className="mb-0">No exams yet. Create your first one to add questions.</p>
        </div>
      )}
      <div className="exam-grid">
        {exams.map((exam) => (
          <article key={exam._id} className="exam-card">
            <div>
              <h2>{exam.title}</h2>
              <p className="exam-card__desc">{exam.description || 'No description.'}</p>
            </div>
            <div className="exam-card__footer" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className="meta-pill">⏱ {exam.durationMinutes} min</span>
                <span
                  className={`badge ${exam.isPublished ? 'badge--success' : 'badge--muted'}`}
                  style={{ textTransform: 'none', fontSize: '0.75rem', letterSpacing: '0.02em' }}
                >
                  {exam.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
              <div className="actions-row" style={{ marginTop: '0.35rem' }}>
                <Link to={`/admin/exams/${exam._id}/results`} className="btn secondary btn--sm">
                  Results
                </Link>
                <Link to={`/admin/exams/${exam._id}/questions`} className="btn secondary btn--sm">
                  Questions
                </Link>
                <Link to={`/admin/exams/${exam._id}/edit`} className="btn secondary btn--sm">
                  Edit
                </Link>
                <button type="button" className="btn danger btn--sm" onClick={() => remove(exam._id)}>
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
