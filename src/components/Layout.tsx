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
} from '@mui/material';
import { accountApi } from '../services/accountApi';
import { PortfolioAccount } from '../types/portfolio';
import {
  Menu as MenuIcon,
  People as PeopleIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
} from '@mui/icons-material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

// Define User type for frontend
interface User {
  id: number;
  name: string;
  email: string;
  provider: string;
}

// Create AuthContext
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
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
        if (!response.redirected) { 
          window.location.href = 'http://localhost:3000/'; 
        }
      } else {
        console.error('Logout request failed:', response.status, response.statusText);
        window.location.href = 'http://localhost:3000/';
      }
    } catch (error) {
      console.error('Logout failed:', error);
      setUser(null); 
      window.location.href = 'http://localhost:3000/';
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


const drawerWidth = 240;

interface LayoutProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ toggleTheme, isDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [account, setAccount] = React.useState<PortfolioAccount | null>(null);
  const { user, login, logout, isLoading } = useAuth();

  React.useEffect(() => {
    if (user) {
        const fetchAccount = async () => {
            const accountId = location.pathname.match(/\/portfolio\/(\d+)/)?.[1];
            if (accountId) {
                try {
                    const accountData = await accountApi.getAccountById(parseInt(accountId));
                    setAccount(accountData);
                } catch (error) {
                    console.error('Error fetching account:', error);
                }
            } else {
                setAccount(null);
            }
        };
        fetchAccount();
    } else {
        setAccount(null); 
    }
  }, [location.pathname, user]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const menuItems = [
    { text: 'Portfolio', icon: <PeopleIcon />, path: '/' },
    { text: 'Accounts', icon: <PeopleIcon />, path: '/accounts' },
  ];

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => {
              navigate(item.path);
              if (isMobile) {
                handleDrawerToggle();
              }
            }}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </div>
  );

  if (isLoading) {
    return <Container><Typography>Loading user...</Typography></Container>;
  }

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
            {account ? account.name : 'Portfolio Tracker'}
          </Typography>
          <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          {user ? (
            <>
              <Typography sx={{ ml: 2 }}>{user.name}</Typography>
              <Button color="inherit" onClick={logout} sx={{ ml: 1 }}>Logout</Button>
            </>
          ) : (
            <Button color="inherit" onClick={login}>Sign in with Google</Button>
          )}
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, 
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
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
        }}
      >
        <Toolbar /> 
        <Container maxWidth={false}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};
