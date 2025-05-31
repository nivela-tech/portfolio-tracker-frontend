import React, { useEffect, useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Define User type for frontend
export interface User {
  id: string;
  name: string;
  email: string;
  imageUrl?: string;
}

// Create AuthContext
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  login: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper to get cookie by name
const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    // Does this cookie string begin with the name we want?
    if (cookie.startsWith(name + '=')) {
      return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }
  return null;
};

// AuthProvider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUser = async () => {
      setAuthLoading(true);
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
        const response = await fetch(`${apiUrl}/api/user/me`, {
          method: 'GET',
          credentials: 'include', // Include cookies for session-based auth
          headers: {
            'Content-Type': 'application/json',
          }
        });
        if (response.ok) {
          const userData = await response.json();
          if (userData && userData.id) { // Check if userData is not null and has id
            setUser(userData);
          } else {
            setUser(null);
          }
        } else {
          console.log('Response not ok:', response.status, response.statusText);
          setUser(null);
          // If unauthorized, clear any stale authentication data
          if (response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    fetchUser();
  }, []); // Only run once on component mount

  // Separate effect for session validation
  useEffect(() => {
    const validateSession = async () => {
      if (user) {
        try {
          const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
          const response = await fetch(`${apiUrl}/api/auth/validate`, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          
          if (!response.ok || response.status === 401) {
            console.log('Session validation failed, clearing user state');
            setUser(null);
            localStorage.clear();
            sessionStorage.clear();
          }
        } catch (error) {
          console.error('Session validation error:', error);
          // Don't clear user on network errors, only on auth failures
        }
      }
    };

    // Only set up interval if user is authenticated
    if (user) {
      const sessionCheckInterval = setInterval(validateSession, 5 * 60 * 1000); // 5 minutes
      return () => clearInterval(sessionCheckInterval);
    }
  }, [user?.id]); // Only depend on user ID to avoid infinite loops
  
  const login = () => {
    window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/oauth2/authorization/google`;
  };
  
  const logout = async () => {
    try {
      // First try our dedicated logout endpoint with better session management
      const csrfToken = getCookie('XSRF-TOKEN');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (csrfToken) {
        headers['X-XSRF-TOKEN'] = csrfToken;
      }
      
      // Clear user state immediately to prevent UI flickering
      setUser(null);
      
      const response = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:8080') + '/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: headers,
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Logout successful:', result.message);
        
        // Clear any local storage or session storage if used
        localStorage.clear();
        sessionStorage.clear();
        
        // Force clear any remaining cookies client-side
        document.cookie.split(";").forEach(function(c) { 
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });
        
        // Navigate to home page
        navigate('/?logout=true');
      } else {
        console.warn('Logout endpoint failed, falling back to default logout');
        // Fallback to default Spring Security logout
        await fallbackLogout();
      }
    } catch (error) {
      console.error('Logout failed, using fallback:', error);
      await fallbackLogout();
    }
  };

  const fallbackLogout = async () => {
    try {
      const csrfToken = getCookie('XSRF-TOKEN');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (csrfToken) {
        headers['X-XSRF-TOKEN'] = csrfToken;
      }
      
      const response = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:8080') + '/logout', {
        method: 'POST',
        credentials: 'include',
        headers: headers,
      });
      
      // Clear state and storage regardless of response
      setUser(null);
      localStorage.clear();
      sessionStorage.clear();
      
      if (response.ok) {
        if (response.redirected || response.url !== window.location.href) {
          if (response.url.includes('logout=true') || response.url.includes('/?logout=true')) {
            navigate('/');
          } else {
            window.location.href = process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000/';
          }
        } else {
          navigate('/');
        }
      } else {
        console.error('Fallback logout request failed:', response.status, response.statusText);
        navigate('/');
      }
    } catch (error) {
      console.error('Fallback logout failed:', error);
      setUser(null);
      navigate('/');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, authLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
