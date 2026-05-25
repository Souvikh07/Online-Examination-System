import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout, isAdmin, isStudent, ready } = useAuth();

  const displayName = user?.name || user?.email || 'User';
  const roleLabel = user?.role === 'admin' ? 'Admin' : user?.role === 'student' ? 'Student' : user?.role;

  return (
    <header className="nav">
      <Link to="/" className="nav-brand">
        <img src="/favicon.png" alt="" className="nav-brand__mark" width={40} height={40} />
        <span className="nav-brand__text">EvoTest</span>
      </Link>
      <nav className="nav-links" aria-label="Main">
        {!ready && <span className="nav-loading">…</span>}
        {ready && !user && (
          <>
            <Link to="/login">Student login</Link>
            <Link to="/register">Sign up</Link>
            <Link to="/admin/login">Admin</Link>
          </>
        )}
        {ready && isStudent && (
          <>
            <Link to="/student">My exams</Link>
            <Link to="/student/results">Results</Link>
          </>
        )}
        {ready && isAdmin && <Link to="/admin">Dashboard</Link>}
        {ready && user && (
          <div className="nav-user" title={`Logged in as ${displayName}`}>
            <span className="nav-user__label">Signed in as</span>
            <span className="nav-user__name">{displayName}</span>
            <span className="badge">{roleLabel}</span>
            <button type="button" className="btn secondary btn--sm" onClick={logout}>
              Log out
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
