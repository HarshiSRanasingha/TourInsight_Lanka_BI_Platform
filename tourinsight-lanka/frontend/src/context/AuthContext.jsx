import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,         setUser]         = useState(null);   // { id, name, email, role, country }
  const [authLoading,  setAuthLoading]  = useState(true);   // true while validating stored token
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab,  setAuthModalTab]  = useState('login'); // 'login' | 'register'

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem('tourinsight_token');
      if (!token) { setAuthLoading(false); return; }
      try {
        const data = await api.getMe(token);
        if (data?.user) setUser(data.user);
        else             localStorage.removeItem('tourinsight_token');
      } catch {
        localStorage.removeItem('tourinsight_token');
      } finally {
        setAuthLoading(false);
      }
    };
    restore();
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await api.login({ email, password });
    if (data.error) throw new Error(data.error);
    localStorage.setItem('tourinsight_token', data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (name, email, password, country) => {
    const data = await api.register({ name, email, password, country });
    if (data.error) throw new Error(data.error);
    localStorage.setItem('tourinsight_token', data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('tourinsight_token');
    setUser(null);
  }, []);

  const openLogin    = useCallback(() => { setAuthModalTab('login');    setShowAuthModal(true); }, []);
  const openRegister = useCallback(() => { setAuthModalTab('register'); setShowAuthModal(true); }, []);
  const closeAuth    = useCallback(() => setShowAuthModal(false), []);

  return (
    <AuthContext.Provider value={{
      user, authLoading,
      isLoggedIn: !!user,
      isAdmin: user?.role === 'admin',
      login, register, logout,
      showAuthModal, authModalTab, setAuthModalTab,
      openLogin, openRegister, closeAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
