import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout, isAdmin, isStudent } = useAuth();

  return (
    <header className="nav">
      <Link to="/" className="nav-brand">
        <span className="nav-brand__mark" aria-hidden>
          ✓
        </span>
        <span>ExamPortal</span>
      </Link>
      <nav className="nav-links" aria-label="Main">
        {!user && (
          <>
            <Link to="/login">Student login</Link>
            <Link to="/register">Sign up</Link>
            <Link to="/admin/login">Admin</Link>
          </>
        )}
        {isStudent && (
          <>
            <Link to="/student">My exams</Link>
            <Link to="/student/results">Results</Link>
          </>
        )}
        {isAdmin && <Link to="/admin">Dashboard</Link>}
        {user && (
          <span className="nav-user">
            <span>{user.name}</span>
            <span className="badge">{user.role}</span>
            <button type="button" className="btn secondary btn--sm" onClick={logout}>
              Log out
            </button>
          </span>
        )}
      </nav>
    </header>
  );
}
