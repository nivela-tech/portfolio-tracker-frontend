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
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };
    fetchUser();
  }, []);
  const login = () => {
    window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/oauth2/authorization/google`;
  };  const logout = async () => {
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
        credentials: 'include', // Include cookies for session-based auth
        headers: headers,
      });
      
      setUser(null); 

      if (response.ok) {
        // Check if the response is a redirect or if the URL changed
        if (response.redirected || response.url !== window.location.href) {
          // If redirected by backend, let the browser handle it.
          // If not, but URL implies logout (e.g. to landing), ensure frontend state is clear.
          if (response.url.includes('logout=true') || response.url.includes('/?logout=true')) {
            navigate('/');
          } else {
            // If backend logout didn't redirect to landing, force it.
            window.location.href = process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000/';
          }
        } else {
          // If no redirect from backend, manually navigate
          navigate('/');
        }
      } else {
        console.error('Logout request failed:', response.status, response.statusText);
        navigate('/'); // Fallback to landing page
      }
    } catch (error) {
      console.error('Logout failed:', error);
      setUser(null); 
      navigate('/'); // Fallback to landing page
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
  // const [account, setAccount] = React.useState<PortfolioAccount | null>(null); // Account fetching might be page-specific
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

  // If not authenticated, Layout should not render its main content.
  // This case should ideally be handled by ProtectedRoute in App.tsx
  // but as a safeguard:
  if (!isAuthenticated) {
     // This will be handled by ProtectedRoute, so this part of Layout might not be strictly necessary
     // if all routes using Layout are protected.
    return null; 
  }  const drawer = (
    <Box>
      <Toolbar sx={{ 
        minHeight: { xs: 64, md: 70 },
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        borderBottom: `1px solid ${theme.palette.mode === 'dark' ? '#334155' : '#e5e7eb'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2
      }}>
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
          </Box>          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 700,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.01em',
            }}
          >
            Flamefolio
          </Typography>
        </Box>
      </Toolbar>
      
      <Box sx={{ 
        p: 2, 
        height: 'calc(100vh - 70px)',
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)'
          : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
      }}>
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
              minHeight: isMobile ? 48 : 44,
              px: 2,
              py: 1.5,
              '&.Mui-selected': {
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(59, 130, 246, 0.12)'
                  : 'rgba(21, 101, 192, 0.08)',
                borderLeft: `3px solid ${theme.palette.primary.main}`,
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(59, 130, 246, 0.16)'
                    : 'rgba(21, 101, 192, 0.12)',
                },
              },
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(59, 130, 246, 0.04)'
                  : 'rgba(21, 101, 192, 0.04)',
                transform: 'translateX(4px)',
                transition: 'all 0.2s ease',
              },
            }}
          >            <ListItemIcon sx={{ minWidth: 40 }}>
              <BusinessCenterIcon sx={{ color: location.pathname.startsWith('/portfolio') ? theme.palette.primary.main : theme.palette.text.secondary }} />
            </ListItemIcon>
            <ListItemText 
              primary="Portfolio" 
              primaryTypographyProps={{
                fontWeight: location.pathname.startsWith('/portfolio') ? 600 : 500,
                fontSize: '0.875rem'
              }}
            />          </ListItemButton>
          
          <ListItemButton 
            component={RouterLink} 
            to="/performance" 
            selected={location.pathname.startsWith('/performance')}
            onClick={handleDrawerClose}
            sx={{ 
              borderRadius: 2,
              mb: 1,
              minHeight: isMobile ? 48 : 44,
              px: 2,
              py: 1.5,
              '&.Mui-selected': {
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(59, 130, 246, 0.12)'
                  : 'rgba(21, 101, 192, 0.08)',
                borderLeft: `3px solid ${theme.palette.primary.main}`,
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(59, 130, 246, 0.16)'
                    : 'rgba(21, 101, 192, 0.12)',
                },
              },
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(59, 130, 246, 0.04)'
                  : 'rgba(21, 101, 192, 0.04)',
                transform: 'translateX(4px)',
                transition: 'all 0.2s ease',
              },
            }}
          >            <ListItemIcon sx={{ minWidth: 40 }}>
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
              minHeight: isMobile ? 48 : 44,
              px: 2,
              py: 1.5,
              '&.Mui-selected': {
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(59, 130, 246, 0.12)'
                  : 'rgba(21, 101, 192, 0.08)',
                borderLeft: `3px solid ${theme.palette.primary.main}`,
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(59, 130, 246, 0.16)'
                    : 'rgba(21, 101, 192, 0.12)',
                },
              },
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(59, 130, 246, 0.04)'
                  : 'rgba(21, 101, 192, 0.04)',
                transform: 'translateX(4px)',
                transition: 'all 0.2s ease',
              },
            }}
          >            <ListItemIcon sx={{ minWidth: 40 }}>
              <AccountBalanceIcon sx={{ color: location.pathname.startsWith('/accounts') ? theme.palette.primary.main : theme.palette.text.secondary }} />
            </ListItemIcon>
            <ListItemText 
              primary="Accounts" 
              primaryTypographyProps={{
                fontWeight: location.pathname.startsWith('/accounts') ? 600 : 500,
                fontSize: '0.875rem'
              }}            />
          </ListItemButton>
          
          <ListItemButton
            component={RouterLink} 
            to="/settings" 
            selected={location.pathname.startsWith('/settings')}
            onClick={handleDrawerClose}
            sx={{ 
              borderRadius: 2,
              mb: 1,
              minHeight: isMobile ? 48 : 44,
              px: 2,
              py: 1.5,
              '&.Mui-selected': {
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(59, 130, 246, 0.12)'
                  : 'rgba(21, 101, 192, 0.08)',
                borderLeft: `3px solid ${theme.palette.primary.main}`,
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(59, 130, 246, 0.16)'
                    : 'rgba(21, 101, 192, 0.12)',
                },
              },
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(59, 130, 246, 0.04)'
                  : 'rgba(21, 101, 192, 0.04)',
                transform: 'translateX(4px)',
                transition: 'all 0.2s ease',
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

        {/* Professional footer in sidebar */}        <Box sx={{ 
          position: 'absolute', 
          bottom: 16, 
          left: 16, 
          right: 16,
          p: 2,
          borderRadius: 2,
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(15, 23, 42, 0.5)'
            : 'rgba(248, 250, 252, 0.8)',
          border: `1px solid ${theme.palette.mode === 'dark' ? '#334155' : '#e5e7eb'}`,        }}>          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.7rem' }}>
            Flamefolio
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.65rem', mt: 0.5 }}>
            v2.0
          </Typography>
        </Box>
      </Box>
    </Box>
  );
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${theme.palette.mode === 'dark' ? '#334155' : '#e5e7eb'}`,
          boxShadow: theme.palette.mode === 'dark'
            ? '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.4)'
            : '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.12)',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 64, md: 70 } }}>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                mr: 2, 
                display: { md: 'none' },
                p: 1.5,
                borderRadius: 2,
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(59, 130, 246, 0.1)' 
                  : 'rgba(21, 101, 192, 0.1)',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(59, 130, 246, 0.2)' 
                    : 'rgba(21, 101, 192, 0.2)',
                }
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 1,
                borderRadius: 2,
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(59, 130, 246, 0.1)' 
                  : 'rgba(21, 101, 192, 0.08)',
              }}
            >
              <AccountBalanceIcon 
                sx={{ 
                  color: theme.palette.primary.main,
                  fontSize: isMobile ? 20 : 24 
                }}
              />              <Typography 
                variant="h6" 
                noWrap 
                component="div" 
                sx={{ 
                  flexGrow: 1, 
                  fontSize: isMobile ? '1.1rem' : '1.25rem',
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em',
                }}
              >
                Flamefolio
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton 
              sx={{ 
                ml: 1,
                p: 1.5,
                borderRadius: 2,
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(148, 163, 184, 0.1)' 
                  : 'rgba(107, 114, 128, 0.1)',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(148, 163, 184, 0.2)' 
                    : 'rgba(107, 114, 128, 0.2)',
                }
              }} 
              onClick={toggleTheme} 
              color="inherit" 
              size={isMobile ? "medium" : "large"}
            >
              {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            
            {user && (
              <Stack direction="row" spacing={isMobile ? 0.5 : 1} alignItems="center" sx={{ ml: isMobile ? 1 : 2 }}>
                {user.imageUrl && (
                  <Avatar 
                    alt={user.name} 
                    src={user.imageUrl} 
                    sx={{ 
                      width: isMobile ? 32 : 36, 
                      height: isMobile ? 32 : 36,
                      border: `2px solid ${theme.palette.primary.main}`,
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 4px 6px rgba(0, 0, 0, 0.3)'
                        : '0 4px 6px rgba(0, 0, 0, 0.1)',
                    }} 
                  />
                )}                {!isMobile && (
                  <Box>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        fontWeight: 600,
                        lineHeight: 1.2,
                        color: theme.palette.text.primary
                      }}
                    >
                      {user.name}
                    </Typography>
                  </Box>
                )}
                <Button 
                  color="inherit" 
                  onClick={logout} 
                  startIcon={!isMobile ? <ExitToAppIcon /> : undefined}
                  size={isMobile ? "small" : "medium"}
                  sx={{ 
                    minWidth: isMobile ? 'auto' : undefined, 
                    px: isMobile ? 1 : 2,
                    borderRadius: 2,
                    fontWeight: 600,
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(239, 68, 68, 0.1)' 
                      : 'rgba(220, 38, 38, 0.1)',
                    color: theme.palette.mode === 'dark' 
                      ? '#f87171' 
                      : '#dc2626',
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? 'rgba(239, 68, 68, 0.2)' 
                        : 'rgba(220, 38, 38, 0.2)',
                    }
                  }}
                >
                  {isMobile ? <ExitToAppIcon /> : 'Logout'}
                </Button>
              </Stack>
            )}
          </Stack>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}          sx={{
            display: { xs: 'block', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: isMobile ? mobileDrawerWidth : drawerWidth 
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: isMobile ? 2 : 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          marginTop: '64px', // AppBar height
          minHeight: 'calc(100vh - 64px)', // Full height minus AppBar
        }}
      >
        {/* <Toolbar />  This was causing double spacing, AppBar is fixed */} 
        {children} {/* Render children passed from App.tsx (Outlet) */}
      </Box>
    </Box>
  );
};
