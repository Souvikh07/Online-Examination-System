import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client.js';

export default function AdminExamResults() {
  const { examId } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [examTitle, setExamTitle] = useState('');

  useEffect(() => {
    const loadResults = async () => {
      try {
        const { data } = await api.get(`/attempts/exam/${examId}`);
        setResults(data);
        if (data.length > 0) {
          setExamTitle(data[0].examTitle);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load results');
      } finally {
        setLoading(false);
      }
    };
    loadResults();
  }, [examId]);

  if (loading) {
    return (
      <div className="container">
        <div className="loading-state">Loading student results…</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="admin-toolbar">
        <header className="page-header" style={{ marginBottom: 0 }}>
          <h1>Results: {examTitle || 'Exam'}</h1>
          <p className="page-header__subtitle">View all student scores for this exam.</p>
        </header>
        <Link to="/admin" className="btn secondary">
          Back to Dashboard
        </Link>
      </div>

      {error ? (
        <p className="error">{error}</p>
      ) : results.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon" aria-hidden>
            👥
          </div>
          <p>No students have completed this exam yet.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Score</th>
                  <th>Percentage</th>
                  <th>Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {results.map((res) => (
                  <tr key={res._id}>
                    <td style={{ fontWeight: 600 }}>{res.studentName}</td>
                    <td className="text-muted">{res.studentEmail}</td>
                    <td style={{ fontWeight: 600 }}>
                      {res.score} / {res.totalQuestions}
                    </td>
                    <td>
                      <span
                        className={`badge ${res.percentage >= 50 ? 'badge--success' : 'badge--warning'}`}
                      >
                        {res.percentage}%
                      </span>
                    </td>
                    <td className="text-muted" style={{ fontSize: '0.9rem' }}>
                      {new Date(res.submittedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
