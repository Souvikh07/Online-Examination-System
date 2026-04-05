import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import api from '../api/client.js';

const AuthContext = createContext(null);

const STORAGE_KEY = 'online_exam_auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.token && parsed?.user) {
          setToken(parsed.token);
          setUser(parsed.user);
          api.defaults.headers.common.Authorization = `Bearer ${parsed.token}`;
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setReady(true);
  }, []);

  const login = (payload) => {
    const { token: t, ...rest } = payload;
    const u = {
      _id: rest._id,
      name: rest.name,
      email: rest.email,
      role: rest.role,
    };
    setToken(t);
    setUser(u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: t, user: u }));
    api.defaults.headers.common.Authorization = `Bearer ${t}`;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem(STORAGE_KEY);
  };

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
