import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, notificationService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const verifyAuth = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          const res = await authService.getCurrentUser();
          if (res.data) {
            setUser((prev) => {
              const updated = { ...(prev || {}), ...res.data };
              localStorage.setItem('user', JSON.stringify(updated));
              return updated;
            });
          }
        } catch {
          // Token expired or invalid
          logout();
        }
      }
      setLoading(false);
    };
    verifyAuth();
  }, []);

  const fetchUnreadCount = async () => {
    if (!token) return;
    try {
      const res = await notificationService.getUnread();
      if (res.data) {
        setUnreadCount(res.data.length);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (token) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000); // 30 sec polling
      return () => clearInterval(interval);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.success && res.data) {
      const { token: jwtToken, ...userData } = res.data;
      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(jwtToken);
      setUser(userData);
      return userData;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (formData) => {
    const res = await authService.register(formData);
    if (res.success && res.data) {
      const { token: jwtToken, ...userData } = res.data;
      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(jwtToken);
      setUser(userData);
      return userData;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setUnreadCount(0);
  };

  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isDoctor = user?.role === 'ROLE_DOCTOR';
  const isReceptionist = user?.role === 'ROLE_RECEPTIONIST';
  const isPatient = user?.role === 'ROLE_PATIENT';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        unreadCount,
        refreshUnread: fetchUnreadCount,
        login,
        register,
        logout,
        isAdmin,
        isDoctor,
        isReceptionist,
        isPatient,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
