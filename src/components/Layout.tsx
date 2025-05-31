import React, { useEffect } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoadingSpinner } from './LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import { TopNavigation } from './navigation/TopNavigation';
import { MobileDrawer } from './navigation/MobileDrawer';

// Re-export AuthProvider and useAuth from the new location
export { AuthProvider, useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
  children: React.ReactNode; // For Outlet
}

export const Layout: React.FC<LayoutProps> = ({ toggleTheme, isDarkMode, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { authLoading, isAuthenticated } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Redirect to landing if not authenticated and not loading
  useEffect(() => {
    if (!authLoading && !isAuthenticated && location.pathname !== '/') {
      navigate('/');
    }
  }, [authLoading, isAuthenticated, navigate, location.pathname]);

  if (authLoading) {
    return (
      <LoadingSpinner variant="page" message="Securing your session..." showIcon={true} />
    );
  }

  if (!isAuthenticated) {
    return null; 
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top Navigation Bar */}
      <TopNavigation 
        toggleTheme={toggleTheme} 
        isDarkMode={isDarkMode} 
        handleDrawerToggle={handleDrawerToggle} 
      />

      {/* Mobile Navigation Drawer */}
      {isMobile && (
        <MobileDrawer mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      )}

      {/* Main Content Area */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          bgcolor: theme.palette.mode === 'dark' ? '#0f172a' : '#f8fafc',
          minHeight: 'calc(100vh - 64px)', // Subtract AppBar height
          overflow: 'auto'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
