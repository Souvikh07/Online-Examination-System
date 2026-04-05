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
      <div className="container" style={{ padding: '2rem 0' }}>
        <div className="loading-state">Loading student results…</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <header className="page-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Results: {examTitle || 'Exam'}</h1>
          <p className="page-header__subtitle">View all student scores for this exam.</p>
        </div>
        <Link to="/admin" className="btn secondary">Back to Dashboard</Link>
      </header>

      {error ? (
        <p className="error">{error}</p>
      ) : results.length === 0 ? (
        <div className="empty-state">
          <p>No students have completed this exam yet.</p>
        </div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: '#f9f9fb', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#475569' }}>Student Name</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#475569' }}>Email</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#475569' }}>Score</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#475569' }}>Percentage</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#475569' }}>Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {results.map((res) => (
                <tr key={res._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '1rem', fontWeight: 500, color: '#1e293b' }}>{res.studentName}</td>
                  <td style={{ padding: '1rem', color: '#64748b' }}>{res.studentEmail}</td>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>
                    {res.score} / {res.totalQuestions}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span
                      className={`badge ${res.percentage >= 50 ? 'badge--success' : 'badge--warning'}`}
                      style={{ fontSize: '0.85rem' }}
                    >
                      {res.percentage}%
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.9rem' }}>
                    {new Date(res.submittedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
