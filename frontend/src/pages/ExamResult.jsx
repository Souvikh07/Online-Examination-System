import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/client.js';

export default function ExamResult() {
  const { attemptId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: d } = await api.get(`/attempts/${attemptId}/result`);
        if (!cancelled) setData(d);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Could not load result');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [attemptId]);

  if (loading) {
    return (
      <div className="container">
        <div className="loading-state">Loading result…</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container">
        <p className="error">{error || 'Not found'}</p>
        <Link to="/student">Back to exams</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="page-header">
        <h1>{data.examTitle}</h1>
        <p className="page-header__subtitle">Here is how you did—review each item below.</p>
      </header>

      <div className="score-banner">
        <p className="score-banner__value">
          {data.score}/{data.totalQuestions}
        </p>
        <p className="score-banner__label">
          {data.percentage}% correct · Submitted {new Date(data.submittedAt).toLocaleString()}
        </p>
      </div>

      <h2 className="section-title">Question review</h2>
      {data.details.map((row, i) => (
        <div key={i} className="card card--flat question-block">
          <p className="q-title">
            {i + 1}. {row.questionText}
          </p>
          <ul className="review-list">
            {row.options.map((o, j) => {
              const isCorrect = j === row.correctOptionIndex;
              const isSelected = j === row.selectedOptionIndex;
              let cls = '';
              if (isCorrect) cls = 'is-correct';
              else if (isSelected && !isCorrect) cls = 'is-wrong';
              return (
                <li key={j} className={cls}>
                  {o}
                  {isCorrect ? ' — correct answer' : ''}
                  {isSelected && !isCorrect ? ' — your answer' : ''}
                </li>
              );
            })}
          </ul>
          {!row.isCorrect && (
            <p className="error" style={{ marginBottom: 0 }}>
              {row.selectedOptionIndex == null
                ? 'You did not answer this question.'
                : `Your answer was option ${row.selectedOptionIndex + 1}.`}
            </p>
          )}
        </div>
      ))}

      <p className="mt-1">
        <Link to="/student" className="btn secondary">
          Back to exams
        </Link>
      </p>
    </div>
  );
}
