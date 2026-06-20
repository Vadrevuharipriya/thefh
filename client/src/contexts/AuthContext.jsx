import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useUserQuery, useLogoutMutation } from '../hooks/auth/useAuth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { data: serverUser, isLoading } = useUserQuery();
  const logoutMutation = useLogoutMutation();

  const [user, setUser] = useState(null);

  // Sync user state with React Query's fetched data
  useEffect(() => {
    if (serverUser !== undefined) {
      setUser(serverUser);
    }
  }, [serverUser]);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  const login = useCallback((userData) => {
    setUser(userData);
  }, []);

  const loginWithGoogle = useCallback(() => {
    window.location.href = `/api/auth/google`;
  }, []);

  const logout = useCallback(() => {
    logoutMutation.mutate();
    setUser(null);
  }, [logoutMutation]);

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        isLoading, 
        isAuthModalOpen, 
        openAuthModal, 
        closeAuthModal, 
        login, 
        loginWithGoogle, 
        logout 
      }}
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
