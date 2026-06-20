import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  const login = useCallback((userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    // Dispatch storage event so other components (Navbar) can sync
    window.dispatchEvent(new Event('storage'));
  }, []);

  const loginWithGoogle = useCallback(() => {
    // Redirect to Google OAuth endpoint via our backend
    // We assume the backend has a route `/api/auth/google` that handles the OAuth flow
    window.location.href = `/api/auth/google`;
  }, []);

  const logout = useCallback(() => {
    fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
    localStorage.removeItem('user');
    setUser(null);
    window.dispatchEvent(new Event('storage'));
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthModalOpen, openAuthModal, closeAuthModal, login, loginWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
