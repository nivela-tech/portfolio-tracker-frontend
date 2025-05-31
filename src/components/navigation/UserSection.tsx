import React from 'react';
import { Box, Typography, Avatar, IconButton, useTheme } from '@mui/material';
import { ExitToApp as ExitToAppIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

export const UserSection: React.FC = () => {
  const theme = useTheme();
  const { user, logout } = useAuth();
  
  return (
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
  );
};
