import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/client.js';

export default function CreateExam() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [isPublished, setIsPublished] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get(`/exams/${id}`);
        if (cancelled) return;
        setTitle(data.title);
        setDescription(data.description || '');
        setDurationMinutes(data.durationMinutes);
        setIsPublished(data.isPublished);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Failed to load exam');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/exams/${id}`, { title, description, durationMinutes, isPublished });
      } else {
        await api.post('/exams', { title, description, durationMinutes, isPublished });
      }
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Link to="/admin" className="link-back">
        ← Back to dashboard
      </Link>
      <div className="card card--interactive auth-card" style={{ maxWidth: 560 }}>
        <h1 style={{ marginTop: 0 }}>{isEdit ? 'Edit exam' : 'Create exam'}</h1>
        <p className="auth-lead" style={{ marginBottom: '1.25rem' }}>
          {isEdit ? 'Update details and visibility.' : 'Set duration and optional description. You can add questions next.'}
        </p>
        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor="title">Title</label>
            <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="duration">Duration (minutes)</label>
            <input
              id="duration"
              type="number"
              min={1}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              required
            />
          </div>
          <div className="field">
            <label>
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
              />
              Published (visible on student dashboard)
            </label>
          </div>
          {error && <p className="error">{error}</p>}
          <div className="actions-row">
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Saving…' : 'Save exam'}
            </button>
            <Link to="/admin" className="btn secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
