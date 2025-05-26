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
  CircularProgress,
  Avatar,
} from '@mui/material';
import { accountApi } from '../services/accountApi';
import { PortfolioAccount } from '../types/portfolio';
import {
  Menu as MenuIcon,
  People as PeopleIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  Dashboard as DashboardIcon, // Added for Portfolio
  AccountBalanceWallet as AccountBalanceWalletIcon, // Added for Accounts
  ExitToApp as ExitToAppIcon, // Added for Logout
  Login as LoginIcon, // Added for Login
} from '@mui/icons-material';
import { useNavigate, useLocation, Outlet, Link as RouterLink } from 'react-router-dom';

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
        const response = await fetch('/api/user/me');
        if (response.ok) {
          const userData = await response.json();
          if (userData && userData.id) { // Check if userData is not null and has id
            setUser(userData);
          } else {
            setUser(null);
          }
        } else {
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
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  const logout = async () => {
    try {
      const csrfToken = getCookie('XSRF-TOKEN');
      const headers: HeadersInit = {};
      if (csrfToken) {
        headers['X-XSRF-TOKEN'] = csrfToken;
      }

      const response = await fetch('http://localhost:8080/logout', {
        method: 'POST',
        headers: headers,
      });
      
      setUser(null); 

      if (response.ok) {
        // Check if the response is a redirect or if the URL changed
        if (response.redirected || response.url !== window.location.href) {
          // If redirected by backend, let the browser handle it.
          // If not, but URL implies logout (e.g. to landing), ensure frontend state is clear.
          if (response.url.includes('logout=true') || response.url === 'http://localhost:3000/') {
            navigate('/');
          } else {
            // If backend logout didn't redirect to landing, force it.
            window.location.href = 'http://localhost:3000/';
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

  // Redirect to landing if not authenticated and not loading
  useEffect(() => {
    if (!authLoading && !isAuthenticated && location.pathname !== '/') {
      navigate('/');
    }
  }, [authLoading, isAuthenticated, navigate, location.pathname]);

  if (authLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // If not authenticated, Layout should not render its main content.
  // This case should ideally be handled by ProtectedRoute in App.tsx
  // but as a safeguard:
  if (!isAuthenticated) {
     // This will be handled by ProtectedRoute, so this part of Layout might not be strictly necessary
     // if all routes using Layout are protected.
    return null; 
  }

  const drawer = (
    <Box>
      <Toolbar /> 
      <List>
        <ListItemButton component={RouterLink} to="/portfolio" selected={location.pathname.startsWith('/portfolio')}>
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Portfolio" />
        </ListItemButton>        <ListItemButton component={RouterLink} to="/accounts" selected={location.pathname.startsWith('/accounts')}>
          <ListItemIcon><AccountBalanceWalletIcon /></ListItemIcon>
          <ListItemText primary="Accounts" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Portfolio Tracker
          </Typography>
          <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          {user && (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: 2 }}>
              {user.imageUrl && <Avatar alt={user.name} src={user.imageUrl} sx={{ width: 32, height: 32 }} />}
              <Typography variant="subtitle1">{user.name}</Typography>
              <Button color="inherit" onClick={logout} startIcon={<ExitToAppIcon />}>
                Logout
              </Button>
            </Stack>
          )}
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
          }}
          sx={{
            display: { xs: 'block', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          marginTop: '64px', // AppBar height
        }}
      >
        {/* <Toolbar />  This was causing double spacing, AppBar is fixed */} 
        {children} {/* Render children passed from App.tsx (Outlet) */}
      </Box>
    </Box>
  );
};
