import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLoginMutation, useSignupMutation } from '../../hooks/auth/useAuth';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  User
} from 'lucide-react';

import './LoginSignupPage.scss';

export default function LoginSignupPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const { mutateAsync: loginMutation } = useLoginMutation();
  const { mutateAsync: signupMutation } = useSignupMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    if (isLogin) {
      try {
        const data = await loginMutation({ email, password });
        login(data.user || data);
        navigate('/');
      } catch (err) {
        console.error('Login error:', err);
        setError(err.response?.data?.error || err.response?.data?.details || 'Login failed');
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
        const data = await signupMutation({ name, email, password });
        login(data.user || data);
        navigate('/');
      } catch (err) {
        console.error('Signup error:', err);
        setError(err.response?.data?.error || err.response?.data?.details || 'Signup failed');
      }
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-page__container">
        <div className="auth-page__header">
          <h1>The Famous Halwai</h1>
          <p>{isLogin ? 'Welcome Back!' : 'Create Your Account'}</p>
        </div>

        <div className="auth-page__tabs">
          <button
            className={`auth-page__tab ${isLogin ? 'auth-page__tab--active' : ''}`}
            onClick={() => setIsLogin(true)}
            type="button"
          >
            Login
          </button>
          <button
            className={`auth-page__tab ${!isLogin ? 'auth-page__tab--active' : ''}`}
            onClick={() => setIsLogin(false)}
            type="button"
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-page__form">
          {error && (
            <div className="auth-page__error">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {!isLogin && (
            <div className="auth-page__field">
              <label htmlFor="name">Full Name</label>
              <div className="auth-page__input-wrapper">
                <User size={18} className="auth-page__icon" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <div className="auth-page__field">
            <label htmlFor="email">Email</label>
            <div className="auth-page__input-wrapper">
              <Mail size={18} className="auth-page__icon" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="auth-page__field">
            <label htmlFor="password">Password</label>
            <div className="auth-page__input-wrapper">
              <Lock size={18} className="auth-page__icon" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="auth-page__toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="auth-page__field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="auth-page__input-wrapper">
                <Lock size={18} className="auth-page__icon" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="auth-page__toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          <button type="submit" className="auth-page__submit" disabled={loading}>
            {loading ? (isLogin ? 'Signing In...' : 'Creating Account...') : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>
      </div>
    </div>
  );
}