import React from 'react';
import { Button, Stack, useTheme } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { 
  BusinessCenter as BusinessCenterIcon,
  Analytics as AnalyticsIcon,
  AccountBalance as AccountBalanceIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

export const HeaderNavLinks: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();
  
  const navItems = [
    { path: '/portfolio', label: 'Portfolio', icon: <BusinessCenterIcon /> },
    { path: '/performance', label: 'Performance', icon: <AnalyticsIcon /> },
    { path: '/accounts', label: 'Accounts', icon: <AccountBalanceIcon /> },
    { path: '/settings', label: 'Settings', icon: <SettingsIcon /> }
  ];
  
  return (
    <Stack direction="row" spacing={1} sx={{ ml: 2 }}>
      {navItems.map((item) => (
        <Button
          key={item.path}
          component={RouterLink}
          to={item.path}
          variant={location.pathname.startsWith(item.path) ? 'contained' : 'text'}
          size="medium"
          startIcon={item.icon}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2,
            px: 2,
            ...(location.pathname.startsWith(item.path) ? {
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
          {item.label}
        </Button>
      ))}
    </Stack>
  );
};
