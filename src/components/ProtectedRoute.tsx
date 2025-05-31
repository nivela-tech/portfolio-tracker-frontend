import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './Layout';
import { LoadingSpinner } from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Route guard component that ensures only authenticated users can access protected routes.
 * Provides additional security by validating session state and redirecting unauthorized users.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isAuthenticated, authLoading } = useAuth();
  const location = useLocation();
  useEffect(() => {
    // Log access attempts for security monitoring only once when auth state changes
    if (!authLoading) {
      if (!isAuthenticated) {
        console.warn(`Unauthorized access attempt to: ${location.pathname}`);
      } else {
        console.log(`Authenticated access to: ${location.pathname} by user: ${user?.email}`);
      }
    }
  }, [isAuthenticated, authLoading, location.pathname]); // Removed user?.email to prevent infinite loops

  // Show loading spinner while checking authentication
  if (authLoading) {
    return <LoadingSpinner />;
  }

  // Redirect to home page if not authenticated
  if (!isAuthenticated || !user) {
    // Preserve the attempted URL for potential redirect after login
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Additional security check - validate required user fields
  if (!user.id || !user.email) {
    console.error('Invalid user session detected, redirecting to login');
    return <Navigate to="/" replace />;
  }

  // User is authenticated and valid, render the protected content
  return <>{children}</>;
};

/**
 * Hook to check if current user has access to sensitive operations
 */
export const useSecurityCheck = () => {
  const { user, isAuthenticated } = useAuth();

  const validateAccess = (operation: string): boolean => {
    if (!isAuthenticated || !user) {
      console.warn(`Unauthorized attempt to perform: ${operation}`);
      return false;
    }

    // Add any additional security checks here
    // For example, check user roles, permissions, etc.
    
    return true;
  };

  return { validateAccess };
};
