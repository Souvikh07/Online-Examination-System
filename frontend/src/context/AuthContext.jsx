import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import api from '../api/client.js';

const AuthContext = createContext(null);

const STORAGE_KEY = 'online_exam_auth';

function normalizeUser(payload) {
  if (!payload) return null;
  const id = payload._id || payload.id;
  const name = payload.name?.trim?.() || payload.name || '';
  const email = payload.email || '';
  const role = payload.role;
  if (!id || !role) return null;
  return { _id: id, name: name || email.split('@')[0] || 'User', email, role };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);

  const persist = (t, u) => {
    if (t && u) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: t, user: u }));
      api.defaults.headers.common.Authorization = `Bearer ${t}`;
    }
  };

  const login = (payload) => {
    const t = payload?.token || payload?.accessToken;
    const u = normalizeUser(payload);
    if (!t || !u) {
      console.error('Invalid login response', payload);
      return;
    }
    setToken(t);
    setUser(u);
    persist(t, u);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem(STORAGE_KEY);
  };

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;

        const parsed = JSON.parse(raw);
        const t = parsed?.token;
        const storedUser = normalizeUser(parsed?.user);

        if (!t || !storedUser) {
          localStorage.removeItem(STORAGE_KEY);
          return;
        }

        setToken(t);
        setUser(storedUser);
        api.defaults.headers.common.Authorization = `Bearer ${t}`;

        try {
          const { data } = await api.get('/auth/me');
          if (cancelled) return;
          const fresh = normalizeUser(data);
          if (fresh) {
            setUser(fresh);
            persist(t, fresh);
          }
        } catch {
          if (!cancelled) logout();
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        if (!cancelled) setReady(true);
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      ready,
      login,
      logout,
      isAdmin: user?.role === 'admin',
      isStudent: user?.role === 'student',
    }),
    [user, token, ready]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
