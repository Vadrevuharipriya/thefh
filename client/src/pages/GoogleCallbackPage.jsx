import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function GoogleCallbackPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Parse query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    const name = urlParams.get('name');
    const email = urlParams.get('email');

    if (userId && name && email) {
      login({ id: userId, name, email });
      navigate('/account', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  }, [login, navigate]);

  return null; // This page doesn't render anything, it just redirects
}