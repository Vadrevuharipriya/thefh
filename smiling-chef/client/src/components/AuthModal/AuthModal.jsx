import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Mail, Lock, Eye, EyeOff, AlertCircle, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './AuthModal.scss';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const overlayRef = useRef(null);
  const navigate = useNavigate();

  // Reset state when modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      setIsLogin(true);
      setError('');
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isAuthModalOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isAuthModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isAuthModalOpen]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closeAuthModal(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeAuthModal]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) closeAuthModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    if (isLogin) {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (response.ok) {
          login(data.user, data.token);
          closeAuthModal();
          navigate('/account');
        } else {
          setError(data.error || data.details || 'Login failed. Please try again.');
        }
      } catch {
        setError('Unable to connect to server. Please check your connection.');
      }
    } else {
      const name = formData.get('name');
      const confirmPassword = formData.get('confirmPassword');
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await response.json();
        if (response.ok) {
          login(data.user, data.token);
          closeAuthModal();
          navigate('/account');
        } else {
          setError(data.error || data.details || 'Signup failed. Please try again.');
        }
      } catch {
        setError('Unable to connect to server. Please check your connection.');
      }
    }
    setLoading(false);
  };

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  if (!isAuthModalOpen) return null;

  return (
    <div
      className="auth-modal-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={isLogin ? 'Login' : 'Sign Up'}
    >
      <div className="auth-modal">
        {/* Close button */}
        <button
          className="auth-modal__close"
          onClick={closeAuthModal}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="auth-modal__header">
          <h2 className="auth-modal__title">
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h2>
          <p className="auth-modal__subtitle">
            {isLogin
              ? 'Sign in to your account to continue'
              : 'Join us for a delightful experience'}
          </p>
        </div>

        {/* Login/Signup Tabs */}
        <div className="auth-modal__tabs">
          <button
            type="button"
            className={`auth-modal__tab ${isLogin ? 'auth-modal__tab--active' : ''}`}
            onClick={() => { setIsLogin(true); setError(''); }}
          >
            Login
          </button>
          <button
            type="button"
            className={`auth-modal__tab ${!isLogin ? 'auth-modal__tab--active' : ''}`}
            onClick={() => { setIsLogin(false); setError(''); }}
          >
            Sign Up
          </button>
        </div>

        {/* Google OAuth */}
        <button
          type="button"
          className="auth-modal__google-btn"
          onClick={handleGoogleLogin}
        >
          <svg className="auth-modal__google-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <div className="auth-modal__divider">
          <span>or</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-modal__form">
          {error && (
            <div className="auth-modal__error" role="alert">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          {!isLogin && (
            <div className="auth-modal__field">
              <label htmlFor="modal-name">Full Name</label>
              <div className="auth-modal__input-wrap">
                <User size={16} className="auth-modal__input-icon" aria-hidden="true" />
                <input
                  id="modal-name"
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  required
                  disabled={loading}
                  autoComplete="name"
                />
              </div>
            </div>
          )}

          <div className="auth-modal__field">
            <label htmlFor="modal-email">Email</label>
            <div className="auth-modal__input-wrap">
              <Mail size={16} className="auth-modal__input-icon" aria-hidden="true" />
              <input
                id="modal-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                disabled={loading}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="auth-modal__field">
            <label htmlFor="modal-password">Password</label>
            <div className="auth-modal__input-wrap">
              <Lock size={16} className="auth-modal__input-icon" aria-hidden="true" />
              <input
                id="modal-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                required
                disabled={loading}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                className="auth-modal__toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="auth-modal__field">
              <label htmlFor="modal-confirm-password">Confirm Password</label>
              <div className="auth-modal__input-wrap">
                <Lock size={16} className="auth-modal__input-icon" aria-hidden="true" />
                <input
                  id="modal-confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  required
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="auth-modal__toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="auth-modal__submit"
            disabled={loading}
          >
            {loading
              ? isLogin ? 'Signing In…' : 'Creating Account…'
              : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="auth-modal__switch">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}
