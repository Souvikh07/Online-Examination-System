import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function PrivateRoute({ children, role }) {
  const { user, ready } = useAuth();
  const location = useLocation();

  if (!ready) {
    return (
      <div className="container">
        <div className="loading-state">Loading…</div>
      </div>
    );
  }

  if (!user) {
    const loginPath = role === 'admin' ? '/admin/login' : '/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    const home = user.role === 'admin' ? '/admin' : '/student';
    return <Navigate to={home} replace />;
  }

  return children;
}
