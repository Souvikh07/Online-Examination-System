import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="container">
      <section className="hero">
        <div className="hero__inner">
          <div className="hero__content">
            <h1>Assessments, simplified.</h1>
            <p>
              Take timed exams with instant scoring, or build rich question banks and publish when you are
              ready—built for students and instructors in one place.
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
            <img src="/hero.png" alt="Futuristic Examination Platform" />
          </div>
        </div>
      </section>

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
  );
}
