import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  Stack,
  Skeleton,
  useTheme,
  alpha
} from '@mui/material';
import { AccountBalance as AccountBalanceIcon } from '@mui/icons-material';

interface LoadingSpinnerProps {
  variant?: 'page' | 'component' | 'skeleton' | 'minimal';
  message?: string;
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  variant = 'component',
  message = 'Loading...',
  size = 'medium',
  showIcon = true
}) => {
  const theme = useTheme();

  const getSize = () => {
    switch (size) {
      case 'small': return 24;
      case 'large': return 64;
      default: return 40;
    }
  };

  const getSpacing = () => {
    switch (size) {
      case 'small': return 1;
      case 'large': return 4;
      default: return 2;
    }
  };

  if (variant === 'page') {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        sx={{
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #e5e7eb 100%)',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
            boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.08)}`,
            textAlign: 'center',
            minWidth: 280
          }}
        >
          <Stack spacing={3} alignItems="center">
            {showIcon && (
              <Box
                sx={{
                  p: 2,
                  borderRadius: '50%',
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -2,
                    left: -2,
                    right: -2,
                    bottom: -2,
                    borderRadius: '50%',
                    background: `conic-gradient(${theme.palette.primary.main}, transparent, ${theme.palette.primary.main})`,
                    animation: 'spin 2s linear infinite',
                    zIndex: -1,
                  },
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }}
              >
                <AccountBalanceIcon
                  sx={{
                    fontSize: 32,
                    color: theme.palette.primary.main,
                  }}
                />
              </Box>
            )}
            <Box>
              <CircularProgress
                size={getSize()}
                thickness={4}
                sx={{
                  color: theme.palette.primary.main,
                  mb: 2,
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  mb: 1,
                }}
              >
                {message}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                }}
              >
                Securing your financial data...
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Box>
    );
  }

  if (variant === 'skeleton') {
    return (
      <Stack spacing={2}>
        <Skeleton
          variant="rectangular"
          height={60}
          sx={{
            borderRadius: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.04),
          }}
        />
        <Stack direction="row" spacing={2}>
          <Skeleton
            variant="circular"
            width={40}
            height={40}
            sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}
          />
          <Stack spacing={1} sx={{ flex: 1 }}>
            <Skeleton
              variant="text"
              height={20}
              width="60%"
              sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}
            />
            <Skeleton
              variant="text"
              height={16}
              width="40%"
              sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}
            />
          </Stack>
        </Stack>
        <Skeleton
          variant="rectangular"
          height={200}
          sx={{
            borderRadius: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.04),
          }}
        />
      </Stack>
    );
  }

  if (variant === 'minimal') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={2}>
        <CircularProgress
          size={getSize()}
          thickness={4}
          sx={{ color: theme.palette.primary.main }}
        />
      </Box>
    );
  }

  // Default component variant
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      p={getSpacing()}
      sx={{ textAlign: 'center' }}
    >
      <CircularProgress
        size={getSize()}
        thickness={4}
        sx={{
          color: theme.palette.primary.main,
          mb: message ? 2 : 0,
        }}
      />
      {message && (
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            fontWeight: 500,
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingSpinner;
