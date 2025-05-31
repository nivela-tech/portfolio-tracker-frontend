import React, { useState } from 'react';
import { 
  Drawer, 
  Box, 
  Typography, 
  List, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  useTheme,
  Collapse
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { 
  BusinessCenter as BusinessCenterIcon,
  Analytics as AnalyticsIcon,
  AccountBalance as AccountBalanceIcon,
  Settings as SettingsIcon,
  Build as BuildIcon,
  CalculateOutlined as CalculateIcon,
  ExpandLess,
  ExpandMore
} from '@mui/icons-material';

interface MobileDrawerProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ 
  mobileOpen, 
  handleDrawerToggle 
}) => {
  const theme = useTheme();
  const location = useLocation();
  const mobileDrawerWidth = 280; // Slightly wider on mobile for better touch targets
  const [toolsOpen, setToolsOpen] = useState(false);

  const handleToolsClick = () => {
    setToolsOpen(!toolsOpen);
  };
  
  const navItems = [
    { 
      path: '/portfolio', 
      label: 'Portfolio', 
      icon: <BusinessCenterIcon /> 
    },
    { 
      path: '/performance', 
      label: 'Performance', 
      icon: <AnalyticsIcon /> 
    },
    { 
      path: '/accounts', 
      label: 'Accounts', 
      icon: <AccountBalanceIcon /> 
    },
    { 
      path: '/tools', 
      label: 'Tools', 
      icon: <BuildIcon />,
      hasSubmenu: true
    },
    { 
      path: '/settings', 
      label: 'Settings', 
      icon: <SettingsIcon /> 
    }
  ];
  
  const handleDrawerClose = () => {
    handleDrawerToggle();
  };

  return (
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
          {navItems.map((item) => (
            item.hasSubmenu ? (
              <React.Fragment key={item.path}>
                <ListItemButton 
                  onClick={handleToolsClick}
                  selected={location.pathname.startsWith(item.path)}
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
                    <Box component="span" sx={{ 
                      color: location.pathname.startsWith(item.path) 
                        ? theme.palette.primary.main 
                        : theme.palette.text.secondary
                    }}>
                      {item.icon}
                    </Box>
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: location.pathname.startsWith(item.path) ? 600 : 500,
                      fontSize: '0.875rem'
                    }}
                  />
                  {toolsOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={toolsOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton 
                      component={RouterLink} 
                      to="/tools/fire-calculator"
                      selected={location.pathname === '/tools/fire-calculator'}
                      onClick={handleDrawerClose}
                      sx={{ 
                        pl: 4,
                        borderRadius: 2,
                        mb: 1,
                        minHeight: 40,
                        ml: 2,
                        '&.Mui-selected': {
                          backgroundColor: theme.palette.mode === 'dark' 
                            ? 'rgba(59, 130, 246, 0.12)'
                            : 'rgba(21, 101, 192, 0.08)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CalculateIcon sx={{ 
                          color: location.pathname === '/tools/fire-calculator' 
                            ? theme.palette.primary.main 
                            : theme.palette.text.secondary
                        }}/>
                      </ListItemIcon>
                      <ListItemText 
                        primary="FIRE Calculator" 
                        primaryTypographyProps={{
                          fontWeight: location.pathname === '/tools/fire-calculator' ? 600 : 500,
                          fontSize: '0.8rem'
                        }}
                      />
                    </ListItemButton>
                  </List>
                </Collapse>
              </React.Fragment>
            ) : (
              <ListItemButton 
                key={item.path}
                component={RouterLink} 
                to={item.path}
                selected={location.pathname.startsWith(item.path)}
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
                  <Box component="span" sx={{ 
                    color: location.pathname.startsWith(item.path) 
                      ? theme.palette.primary.main 
                      : theme.palette.text.secondary
                  }}>
                    {item.icon}
                  </Box>
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: location.pathname.startsWith(item.path) ? 600 : 500,
                    fontSize: '0.875rem'
                  }}
                />
              </ListItemButton>
            )
          ))}
        </List>
      </Box>
    </Drawer>
  );
};
