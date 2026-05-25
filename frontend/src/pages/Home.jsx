import { Link } from 'react-router-dom';

const SUBJECTS = [
  { name: 'Mathematics', className: 'subject-chip--math' },
  { name: 'Science', className: 'subject-chip--science' },
  { name: 'English', className: 'subject-chip--english' },
  { name: 'History', className: 'subject-chip--history' },
  { name: 'Computer Science', className: 'subject-chip--cs' },
];

export default function Home() {
  return (
    <>
      <div className="container">
        <section className="hero">
          <div className="hero__inner">
            <div className="hero__content">
              <span className="hero__badge">Online Examination System</span>
              <h1>
                Assessments, <span>refined.</span>
              </h1>
              <p>
                Take timed exams with instant scoring, or build rich question banks and publish when you
                are ready—built for students and instructors in one place.
              </p>
              <div className="hero-actions">
                <Link to="/register" className="btn">
                  Get started
                </Link>
                <Link to="/login" className="btn secondary">
                  Student login
                </Link>
                <Link to="/admin/login" className="btn secondary">
                  Admin login
                </Link>
              </div>
            </div>
            <div className="hero__image-wrapper">
              <img src="/hero.png" alt="Students using the examination platform" />
            </div>
          </div>
        </section>

        <div className="subjects-strip" aria-label="Available subjects">
          {SUBJECTS.map((s) => (
            <span key={s.name} className={`subject-chip ${s.className}`}>
              <span className="subject-chip__dot" aria-hidden />
              {s.name}
            </span>
          ))}
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat__value">5</span>
            <span className="hero-stat__label">Subject areas</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat__value">MCQ</span>
            <span className="hero-stat__label">Auto-graded</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat__value">Live</span>
            <span className="hero-stat__label">Instant results</span>
          </div>
        </div>
      </div>

      <div className="content-panel">
        <div className="container">
          <div className="section-heading">
            <h2>Everything you need to run fair exams</h2>
            <p>Secure, fast, and built for modern classrooms.</p>
          </div>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon" aria-hidden>
                ⏱
              </div>
              <h3>Timed exams</h3>
              <p>Countdown timer with automatic submission so every attempt stays fair and consistent.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" aria-hidden>
                📊
              </div>
              <h3>Instant results</h3>
              <p>Scores and per-question review as soon as you submit—no waiting for manual grading.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" aria-hidden>
                🛡
              </div>
              <h3>Role-based access</h3>
              <p>Students see only published tests; admins manage exams and questions behind secure login.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
