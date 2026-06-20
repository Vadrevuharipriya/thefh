import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';

import './AdminLoginPage.scss';

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState('');

  const [loading, setLoading] =
    useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email =
      document.getElementById('email').value;

    const password =
      document.getElementById('password').value;

    console.log('EMAIL:', email);
    console.log('PASSWORD:', password);

    if (!email || !password) {
      setError(
        'Username and password are required'
      );
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        '/api/admin/login',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json();

      console.log(data);

      if (response.ok) {
        navigate('/admin/dashboard');

      } else {
        setError(
          data.error || 'Login failed'
        );
      }

    } catch (err) {
      console.error(err);

      setError(
        'Network error. Please try again.'
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login__container">

        <div className="admin-login__header">
          <h1>The Famous Halwai</h1>
          <p>Admin Panel</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="admin-login__form"
        >

          {error && (
            <div className="admin-login__error">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="admin-login__field">
            <label htmlFor="email">
              Email
            </label>

            <div className="admin-login__input-wrapper">
              <Mail
                size={18}
                className="admin-login__icon"
              />

              <input
                id="email"
                name="email"
                type="email"
                placeholder="admin@example.com"
                autoComplete="email"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="admin-login__field">
            <label htmlFor="password">
              Password
            </label>

            <div className="admin-login__input-wrapper">
              <Lock
                size={18}
                className="admin-login__icon"
              />

              <input
                id="password"
                name="password"
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                disabled={loading}
              />

              <button
                type="button"
                className="admin-login__toggle"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>
          </div>

          <button
            type="submit"
            className="admin-login__submit"
            disabled={loading}
          >
            {loading
              ? 'Signing In...'
              : 'Sign In'}
          </button>

        </form>
      </div>
    </div>
  );
}