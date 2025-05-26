import React, { useEffect } from 'react';
import { useAuth } from '../components/Layout';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const { login, isAuthenticated, authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate('/portfolio');
    }
  }, [isAuthenticated, authLoading, navigate]);

  if (authLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  // If already authenticated and not loading, useEffect will navigate away.
  // If not authenticated, show the login button.
  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center' }}>
        <h1>Welcome to Your Portfolio Tracker</h1>
        <p>Securely manage and track your investments.</p>
        <button 
          onClick={login} 
          style={{ 
            padding: '12px 24px', 
            fontSize: '18px', 
            cursor: 'pointer', 
            backgroundColor: '#4285F4', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            boxShadow: '0 2px 4px 0 rgba(0,0,0,0.25)'
          }}
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  // Should ideally not be reached if useEffect works correctly
  return null; 
};

export default LandingPage;
