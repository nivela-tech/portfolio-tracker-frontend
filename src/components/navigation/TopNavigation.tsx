import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Box, 
  Stack, 
  IconButton, 
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Brightness4 as Brightness4Icon, 
  Brightness7 as Brightness7Icon,
  Menu as MenuIcon 
} from '@mui/icons-material';

import { Logo } from './Logo';
import { HeaderNavLinks } from './HeaderNavLinks';
import { UserSection } from './UserSection';

interface TopNavigationProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
  handleDrawerToggle: () => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({ 
  toggleTheme, 
  isDarkMode, 
  handleDrawerToggle 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
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
          <Logo />
          
          {/* Navigation Links - Hidden on mobile */}
          {!isMobile && <HeaderNavLinks />}
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
          <UserSection />
          
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
  );
};
