import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { AccountBalance as AccountBalanceIcon } from '@mui/icons-material';

export const Logo: React.FC = () => {
  const theme = useTheme();
  
  return (
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
  );
};
