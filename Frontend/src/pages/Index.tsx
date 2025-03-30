import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    if (user && user.isLoggedIn) {
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/patient/dashboard');
      }
    } else {
      // Redirect to login page
      navigate('/login');
    }
  }, [navigate]);

  return null;
};

export default Index;