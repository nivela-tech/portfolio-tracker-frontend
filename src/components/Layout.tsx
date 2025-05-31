import React, { useEffect, useState, createContext, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Container,
  IconButton,
  useTheme,
  useMediaQuery,
  Stack,
  Button,
  Avatar,
} from '@mui/material';
import { accountApi } from '../services/accountApi';
import { PortfolioAccount } from '../types/portfolio';
import {
  Menu as MenuIcon,
  People as PeopleIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  BusinessCenter as BusinessCenterIcon, // Better for Portfolio (business/investment portfolio)
  Analytics as AnalyticsIcon, // Even better for Performance/Analytics
  AccountBalance as AccountBalanceIcon, // Better for bank accounts
  Settings as SettingsIcon, // Added for Settings
  ExitToApp as ExitToAppIcon, // Added for Logout
  Login as LoginIcon, // Added for Login
} from '@mui/icons-material';
import { useNavigate, useLocation, Outlet, Link as RouterLink } from 'react-router-dom';
import { LoadingSpinner } from './LoadingSpinner';

// Define User type for frontend
interface User {
  id: string; // Changed to string to match typical provider IDs
  name: string;
  email: string;
  imageUrl?: string; // Added imageUrl
  // provider: string; // Removed provider as it's less used directly in UI
}

// Create AuthContext
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean; // Renamed from user !== null for clarity
  authLoading: boolean; // Renamed from isLoading for clarity
  login: () => void;
  logout: () => Promise<void>; // Changed to Promise<void>
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
  const navigate = useNavigate();  useEffect(() => {
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
  };  const logout = async () => {
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


const drawerWidth = 240;
const mobileDrawerWidth = 280; // Slightly wider on mobile for better touch targets

interface LayoutProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
  children: React.ReactNode; // Added children prop for Outlet
}

export const Layout: React.FC<LayoutProps> = ({ toggleTheme, isDarkMode, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { user, logout, authLoading, isAuthenticated } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerClose = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  // Redirect to landing if not authenticated and not loading
  React.useEffect(() => {
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
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderBottom: `1px solid ${theme.palette.mode === 'dark' ? '#334155' : '#e5e7eb'}`,
          color: theme.palette.text.primary
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 3 } }}>
          {/* Left side - Logo and Navigation */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  p: 1,
                  borderRadius: 2,
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(59, 130, 246, 0.1)' 
                    : 'rgba(21, 101, 192, 0.1)',
                }}
              >
                <AccountBalanceIcon 
                  sx={{ 
                    color: theme.palette.primary.main,
                    fontSize: 20
                  }}
                />
              </Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.01em',
                }}
              >
                Agni Folio
              </Typography>
            </Box>

            {/* Navigation Links - Hidden on mobile */}
            {!isMobile && (
              <Stack direction="row" spacing={1} sx={{ ml: 2 }}>
                <Button
                  component={RouterLink}
                  to="/portfolio"
                  variant={location.pathname.startsWith('/portfolio') ? 'contained' : 'text'}
                  size="medium"
                  startIcon={<BusinessCenterIcon />}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                    px: 2,
                    ...(location.pathname.startsWith('/portfolio') ? {
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    } : {
                      color: theme.palette.text.secondary,
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark' 
                          ? 'rgba(59, 130, 246, 0.08)'
                          : 'rgba(21, 101, 192, 0.08)',
                      }
                    })
                  }}
                >
                  Portfolio
                </Button>
                <Button
                  component={RouterLink}
                  to="/performance"
                  variant={location.pathname.startsWith('/performance') ? 'contained' : 'text'}
                  size="medium"
                  startIcon={<AnalyticsIcon />}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                    px: 2,
                    ...(location.pathname.startsWith('/performance') ? {
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    } : {
                      color: theme.palette.text.secondary,
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark' 
                          ? 'rgba(59, 130, 246, 0.08)'
                          : 'rgba(21, 101, 192, 0.08)',
                      }
                    })
                  }}
                >
                  Performance
                </Button>
                <Button
                  component={RouterLink}
                  to="/accounts"
                  variant={location.pathname.startsWith('/accounts') ? 'contained' : 'text'}
                  size="medium"
                  startIcon={<AccountBalanceIcon />}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                    px: 2,
                    ...(location.pathname.startsWith('/accounts') ? {
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    } : {
                      color: theme.palette.text.secondary,
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark' 
                          ? 'rgba(59, 130, 246, 0.08)'
                          : 'rgba(21, 101, 192, 0.08)',
                      }
                    })
                  }}
                >
                  Accounts
                </Button>
                <Button
                  component={RouterLink}
                  to="/settings"
                  variant={location.pathname.startsWith('/settings') ? 'contained' : 'text'}
                  size="medium"
                  startIcon={<SettingsIcon />}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                    px: 2,
                    ...(location.pathname.startsWith('/settings') ? {
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    } : {
                      color: theme.palette.text.secondary,
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark' 
                          ? 'rgba(59, 130, 246, 0.08)'
                          : 'rgba(21, 101, 192, 0.08)',
                      }
                    })
                  }}
                >
                  Settings
                </Button>
              </Stack>
            )}
          </Box>

          {/* Right side - Theme toggle, User menu, Mobile menu */}
          <Stack direction="row" spacing={2} alignItems="center">
            {/* Theme Toggle */}
            <IconButton 
              onClick={toggleTheme} 
              sx={{ 
                color: theme.palette.text.secondary,
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(59, 130, 246, 0.08)'
                    : 'rgba(21, 101, 192, 0.08)',
                }
              }}
            >
              {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>

            {/* User Avatar and Logout */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {user?.imageUrl && (
                <Avatar 
                  src={user.imageUrl} 
                  alt={user.name}
                  sx={{ width: 32, height: 32 }}
                />
              )}
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.2 }}>
                  {user?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
                  {user?.email}
                </Typography>
              </Box>
              <IconButton 
                onClick={logout}
                sx={{ 
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    backgroundColor: theme.palette.error.main + '20',
                    color: theme.palette.error.main
                  }
                }}
                title="Logout"
              >
                <ExitToAppIcon />
              </IconButton>
            </Box>

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ 
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(59, 130, 246, 0.08)'
                      : 'rgba(21, 101, 192, 0.08)',
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: mobileDrawerWidth,
              background: theme.palette.mode === 'dark' 
                ? 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)'
                : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography 
              variant="overline" 
              sx={{ 
                color: theme.palette.text.secondary,
                fontWeight: 600,
                letterSpacing: 1.2,
                fontSize: '0.7rem',
                px: 2,
                mb: 2,
                display: 'block'
              }}
            >
              Navigation
            </Typography>
            
            <List sx={{ px: 0 }}>
              <ListItemButton 
                component={RouterLink} 
                to="/portfolio" 
                selected={location.pathname.startsWith('/portfolio')}
                onClick={handleDrawerClose}
                sx={{ 
                  borderRadius: 2,
                  mb: 1,
                  minHeight: 48,
                  px: 2,
                  py: 1.5,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(59, 130, 246, 0.12)'
                      : 'rgba(21, 101, 192, 0.08)',
                    borderLeft: `3px solid ${theme.palette.primary.main}`,
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <BusinessCenterIcon sx={{ color: location.pathname.startsWith('/portfolio') ? theme.palette.primary.main : theme.palette.text.secondary }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Portfolio" 
                  primaryTypographyProps={{
                    fontWeight: location.pathname.startsWith('/portfolio') ? 600 : 500,
                    fontSize: '0.875rem'
                  }}
                />
              </ListItemButton>
              
              <ListItemButton 
                component={RouterLink} 
                to="/performance" 
                selected={location.pathname.startsWith('/performance')}
                onClick={handleDrawerClose}
                sx={{ 
                  borderRadius: 2,
                  mb: 1,
                  minHeight: 48,
                  px: 2,
                  py: 1.5,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(59, 130, 246, 0.12)'
                      : 'rgba(21, 101, 192, 0.08)',
                    borderLeft: `3px solid ${theme.palette.primary.main}`,
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <AnalyticsIcon sx={{ color: location.pathname.startsWith('/performance') ? theme.palette.primary.main : theme.palette.text.secondary }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Performance" 
                  primaryTypographyProps={{
                    fontWeight: location.pathname.startsWith('/performance') ? 600 : 500,
                    fontSize: '0.875rem'
                  }}
                />
              </ListItemButton>
              
              <ListItemButton
                component={RouterLink} 
                to="/accounts" 
                selected={location.pathname.startsWith('/accounts')}
                onClick={handleDrawerClose}
                sx={{ 
                  borderRadius: 2,
                  mb: 1,
                  minHeight: 48,
                  px: 2,
                  py: 1.5,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(59, 130, 246, 0.12)'
                      : 'rgba(21, 101, 192, 0.08)',
                    borderLeft: `3px solid ${theme.palette.primary.main}`,
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <AccountBalanceIcon sx={{ color: location.pathname.startsWith('/accounts') ? theme.palette.primary.main : theme.palette.text.secondary }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Accounts" 
                  primaryTypographyProps={{
                    fontWeight: location.pathname.startsWith('/accounts') ? 600 : 500,
                    fontSize: '0.875rem'
                  }}
                />
              </ListItemButton>
              
              <ListItemButton
                component={RouterLink} 
                to="/settings" 
                selected={location.pathname.startsWith('/settings')}
                onClick={handleDrawerClose}
                sx={{ 
                  borderRadius: 2,
                  mb: 1,
                  minHeight: 48,
                  px: 2,
                  py: 1.5,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(59, 130, 246, 0.12)'
                      : 'rgba(21, 101, 192, 0.08)',
                    borderLeft: `3px solid ${theme.palette.primary.main}`,
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <SettingsIcon sx={{ color: location.pathname.startsWith('/settings') ? theme.palette.primary.main : theme.palette.text.secondary }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Settings" 
                  primaryTypographyProps={{
                    fontWeight: location.pathname.startsWith('/settings') ? 600 : 500,
                    fontSize: '0.875rem'
                  }}
                />
              </ListItemButton>
            </List>
          </Box>
        </Drawer>
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
