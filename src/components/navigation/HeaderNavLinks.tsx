import React, { useState } from 'react';
import { Button, Stack, useTheme, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { 
  BusinessCenter as BusinessCenterIcon,
  Analytics as AnalyticsIcon,
  AccountBalance as AccountBalanceIcon,
  Settings as SettingsIcon,
  Build as BuildIcon,
  CalculateOutlined as CalculateIcon
} from '@mui/icons-material';

export const HeaderNavLinks: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();
  const [toolsAnchorEl, setToolsAnchorEl] = useState<null | HTMLElement>(null);
  
  const handleToolsMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setToolsAnchorEl(event.currentTarget);
  };
  
  const handleToolsMenuClose = () => {
    setToolsAnchorEl(null);
  };
  
  const navItems = [
    { path: '/portfolio', label: 'Portfolio', icon: <BusinessCenterIcon /> },
    { path: '/performance', label: 'Performance', icon: <AnalyticsIcon /> },
    { path: '/accounts', label: 'Accounts', icon: <AccountBalanceIcon /> },
    { path: '/tools', label: 'Tools', icon: <BuildIcon />, hasSubmenu: true },
    { path: '/settings', label: 'Settings', icon: <SettingsIcon /> }
  ];
  
  const toolsSubItems = [
    { path: '/tools/fire-calculator', label: 'FIRE Calculator', icon: <CalculateIcon /> },
  ];
  
  return (
    <Stack direction="row" spacing={1} sx={{ ml: 2 }}>
      {navItems.map((item) => (
        item.hasSubmenu ? (
          <React.Fragment key={item.path}>
            <Button
              onClick={handleToolsMenuOpen}
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
            <Menu
              anchorEl={toolsAnchorEl}
              open={Boolean(toolsAnchorEl)}
              onClose={handleToolsMenuClose}
              MenuListProps={{
                'aria-labelledby': 'tools-button',
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              PaperProps={{
                elevation: 3,
                sx: {
                  borderRadius: 2,
                  minWidth: 180,
                  overflow: 'visible',
                  mt: 1,
                }
              }}
            >
              {toolsSubItems.map((subItem) => (
                <MenuItem 
                  key={subItem.path} 
                  component={RouterLink} 
                  to={subItem.path}
                  onClick={handleToolsMenuClose}
                  selected={location.pathname === subItem.path}
                  sx={{
                    borderRadius: 1,
                    mx: 1,
                    my: 0.5,
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? 'rgba(59, 130, 246, 0.08)'
                        : 'rgba(21, 101, 192, 0.08)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {subItem.icon}
                  </ListItemIcon>
                  <ListItemText>{subItem.label}</ListItemText>
                </MenuItem>
              ))}
            </Menu>
          </React.Fragment>
        ) : (
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
        )
      ))}
    </Stack>
  );
};
