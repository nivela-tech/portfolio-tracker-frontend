import React, { useEffect, useState } from 'react';
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

  React.useEffect(() => {
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
  }, [location.pathname]);

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
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ flexGrow: 1 }}>
            <Typography variant="h6" noWrap component="div" color="inherit">
              Portfolio Tracker
            </Typography>
            {location.pathname.includes('/portfolio/') && (
              <>
                <Typography variant="h6" noWrap component="div" color="inherit">
                  {' → '}
                </Typography>
                <Typography variant="h6" noWrap component="div" color="inherit">
                  {account?.name || 'Combined View'}
                </Typography>
              </>
            )}
          </Stack>
          <IconButton color="inherit" onClick={toggleTheme}>
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
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
            keepMounted: true, // Better open performance on mobile.
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
        <Toolbar /> {/* This adds space below the AppBar */}
        <Container maxWidth={false}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};
