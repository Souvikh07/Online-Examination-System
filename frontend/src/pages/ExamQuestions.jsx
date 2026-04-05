import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/client.js';

export default function ExamQuestions() {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [ex, qs] = await Promise.all([
        api.get(`/exams/${examId}`),
        api.get(`/exams/${examId}/questions`),
      ]);
      setExam(ex.data);
      setQuestions(qs.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [examId]);

  const addOption = () => setOptions((o) => [...o, '']);

  const updateOption = (i, v) => {
    setOptions((o) => o.map((x, j) => (j === i ? v : x)));
  };

  const removeOption = (i) => {
    setOptions((prev) => {
      const next = prev.filter((_, j) => j !== i);
      setCorrectOptionIndex((c) => {
        if (next.length === 0) return 0;
        if (i === c) return 0;
        if (i < c) return Math.min(c - 1, next.length - 1);
        return Math.min(c, next.length - 1);
      });
      return next;
    });
  };

  const addQuestion = async (e) => {
    e.preventDefault();
    setError('');
    const cleaned = options.map((s) => s.trim()).filter(Boolean);
    if (cleaned.length < 2) {
      setError('Enter at least two non-empty options');
      return;
    }
    if (correctOptionIndex < 0 || correctOptionIndex >= cleaned.length) {
      setError('Select a valid correct option');
      return;
    }
    try {
      await api.post(`/exams/${examId}/questions`, {
        questionText: questionText.trim(),
        options: cleaned,
        correctOptionIndex,
      });
      setQuestionText('');
      setOptions(['', '']);
      setCorrectOptionIndex(0);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add question');
    }
  };

  const del = async (qid) => {
    if (!window.confirm('Remove this question?')) return;
    try {
      await api.delete(`/questions/${qid}`);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading && !exam) {
    return (
      <div className="container">
        <div className="loading-state">Loading…</div>
      </div>
    );
  }

  return (
    <div className="container">
      <Link to="/admin" className="link-back">
        ← Dashboard
      </Link>
      <header className="page-header">
        <h1>{exam?.title || 'Exam'}</h1>
        <p className="page-header__subtitle">Build your multiple-choice bank. Mark the correct option for each row.</p>
      </header>
      {error && <p className="error">{error}</p>}

      <div className="card card--interactive">
        <h2 className="section-title" style={{ marginTop: 0 }}>
          Add question
        </h2>
        <form onSubmit={addQuestion}>
          <div className="field">
            <label htmlFor="q">Question</label>
            <textarea
              id="q"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              required
            />
          </div>
          {options.map((opt, i) => (
            <div key={i} className="field">
              <label>Option {i + 1}</label>
              <input value={opt} onChange={(e) => updateOption(i, e.target.value)} />
              {options.length > 2 && (
                <button type="button" className="btn secondary btn--sm mt-1" onClick={() => removeOption(i)}>
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" className="btn secondary" onClick={addOption}>
            + Add option
          </button>
          <div className="field mt-1">
            <label htmlFor="correct">Correct answer</label>
            <select
              id="correct"
              value={correctOptionIndex}
              onChange={(e) => setCorrectOptionIndex(Number(e.target.value))}
            >
              {options.map((_, i) => (
                <option key={i} value={i}>
                  Option {i + 1}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn">
            Add to exam
          </button>
        </form>
      </div>

      <h2 className="section-title">Questions ({questions.length})</h2>
      {questions.map((q) => (
        <div key={q._id} className="card question-block">
          <p className="q-title" style={{ marginBottom: '0.75rem' }}>
            {q.questionText}
          </p>
          <ol style={{ margin: '0 0 1rem', paddingLeft: '1.25rem', color: 'var(--color-text-muted)' }}>
            {q.options.map((o, i) => (
              <li key={i} style={{ marginBottom: '0.25rem', color: i === q.correctOptionIndex ? 'var(--color-success)' : undefined, fontWeight: i === q.correctOptionIndex ? 600 : 400 }}>
                {o}
                {i === q.correctOptionIndex ? ' ✓' : ''}
              </li>
            ))}
          </ol>
          <button type="button" className="btn danger btn--sm" onClick={() => del(q._id)}>
            Delete question
          </button>
        </div>
      ))}
    </div>
  );
}
