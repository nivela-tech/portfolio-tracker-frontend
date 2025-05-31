import React from 'react';
import { 
  Box, 
  Container, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Avatar, 
  Stack,
  IconButton,
  useTheme
} from '@mui/material';
import { 
  Home as HomeIcon,
  Login as LoginIcon,
  Whatshot as FireIcon 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FireCalculatorPage } from '../pages/FireCalculatorPage';

export const PublicFireCalculator: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Simple Header */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, #1a365d 0%, #2d3748 100%)'
            : 'linear-gradient(135deg, #1a365d 0%, #2d3748 100%)',
          borderBottom: `1px solid ${theme.palette.mode === 'dark' ? '#334155' : 'rgba(255,255,255,0.1)'}`
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              sx={{
                bgcolor: '#ff6b35',
                color: '#ffffff',
                width: 40,
                height: 40,
                fontWeight: 'bold'
              }}
            >
              <FireIcon />
            </Avatar>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '-0.02em'
              }}
            >
              Agni Folio
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'rgba(255,255,255,0.7)',
                ml: 1
              }}
            >
              FIRE Calculator
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={1}>
            <IconButton 
              color="inherit" 
              onClick={() => navigate('/')}
              sx={{ color: 'rgba(255,255,255,0.9)' }}
            >
              <HomeIcon />
            </IconButton>
            <Button
              variant="outlined"
              size="small"
              startIcon={<LoginIcon />}
              onClick={login}
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.4)',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Sign In
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <FireCalculatorPage />
      </Container>
      
      {/* Simple Footer */}
      <Box 
        sx={{ 
          mt: 4, 
          py: 2, 
          borderTop: `1px solid ${theme.palette.divider}`,
          textAlign: 'center' 
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Agni Folio - Free FIRE Calculator | 
          <Button 
            size="small" 
            onClick={login}
            sx={{ 
              textTransform: 'none', 
              textDecoration: 'underline',
              fontWeight: 'normal',
              p: 0,
              ml: 1
            }}
          >
            Sign in for full portfolio tracking
          </Button>
        </Typography>
      </Box>
    </Box>
  );
};
