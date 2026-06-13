import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function GoogleCallbackPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Parse query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userId = urlParams.get('userId');
    const name = urlParams.get('name');
    const email = urlParams.get('email');

    if (token && userId && name && email) {
      // Call login function from AuthContext
      login({ id: userId, name, email }, token);
      // Redirect to account page
      navigate('/account', { replace: true });
    } else {
      // If missing parameters, redirect to home
      navigate('/', { replace: true });
    }
  }, [login, navigate]);

  return null; // This page doesn't render anything, it just redirects
}