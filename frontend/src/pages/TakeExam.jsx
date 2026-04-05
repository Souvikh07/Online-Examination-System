import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/client.js';
import ExamTimer from '../components/ExamTimer.jsx';

export default function TakeExam() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [attemptId, setAttemptId] = useState(null);
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const submitLock = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.post(`/exams/${examId}/start`);
        if (cancelled) return;
        setAttemptId(data.attemptId);
        setExam(data.exam);
        setQuestions(data.questions || []);
        const init = {};
        (data.questions || []).forEach((q) => {
          init[q._id] = null;
        });
        setAnswers(init);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Could not start exam');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [examId]);

  const select = (questionId, optionIndex) => {
    setAnswers((a) => ({ ...a, [questionId]: optionIndex }));
  };

  const submit = useCallback(async () => {
    if (!attemptId || submitLock.current) return;
    submitLock.current = true;
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        answers: questions.map((q) => ({
          questionId: q._id,
          selectedOptionIndex: answers[q._id],
        })),
      };
      await api.post(`/attempts/${attemptId}/submit`, payload);
      navigate(`/student/result/${attemptId}`, { replace: true });
    } catch (err) {
      submitLock.current = false;
      setError(err.response?.data?.message || 'Submit failed');
    } finally {
      setSubmitting(false);
    }
  }, [attemptId, answers, questions, navigate]);

  const onExpire = useCallback(() => {
    submit();
  }, [submit]);

  if (loading) {
    return (
      <div className="container">
        <div className="loading-state">Starting your exam…</div>
      </div>
    );
  }

  if (error && !exam) {
    return (
      <div className="container">
        <p className="error">{error}</p>
        <p className="mt-1">
          <Link to="/student">← Back to exams</Link>
        </p>
      </div>
    );
  }

  const durationSeconds = (exam?.durationMinutes || 0) * 60;

  return (
    <div className="container">
      <div className="exam-header">
        <div>
          <h1>{exam?.title}</h1>
          {exam?.description ? <p className="exam-header__meta">{exam.description}</p> : null}
          <p className="exam-header__meta">
            {questions.length} question{questions.length === 1 ? '' : 's'} · {exam?.durationMinutes} min limit
          </p>
        </div>
        <ExamTimer durationSeconds={durationSeconds} onExpire={onExpire} />
      </div>
      {error && <p className="error">{error}</p>}

      {questions.map((q, idx) => (
        <div key={q._id} className="card card--flat question-block">
          <p className="q-title">
            {idx + 1}. {q.questionText}
          </p>
          {q.options.map((opt, i) => (
            <label key={i} className="option">
              <input
                type="radio"
                name={q._id}
                checked={answers[q._id] === i}
                onChange={() => select(q._id, i)}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      ))}

      <div className="actions-row mt-1">
        <button type="button" className="btn" onClick={submit} disabled={submitting}>
          {submitting ? 'Submitting…' : 'Submit answers'}
        </button>
        <span className="text-muted" style={{ fontSize: '0.875rem' }}>
          Answers are saved when you submit. Timer may auto-submit.
        </span>
      </div>
    </div>
  );
}
