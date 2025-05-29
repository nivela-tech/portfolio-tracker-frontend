import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  useTheme,
  alpha,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';

interface ErrorDisplayProps {
  error?: string | null;
  severity?: 'error' | 'warning' | 'info';
  variant?: 'inline' | 'snackbar' | 'full-page';
  onRetry?: () => void;
  onClose?: () => void;
  title?: string;
  showIcon?: boolean;
  autoHideDuration?: number;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  severity = 'error',
  variant = 'inline',
  onRetry,
  onClose,
  title,
  showIcon = true,
  autoHideDuration = 6000
}) => {
  const theme = useTheme();

  if (!error) return null;

  const getIcon = () => {
    switch (severity) {
      case 'warning': return <WarningIcon />;
      case 'info': return <InfoIcon />;
      default: return <ErrorIcon />;
    }
  };

  const getColor = () => {
    switch (severity) {
      case 'warning': return theme.palette.warning;
      case 'info': return theme.palette.info;
      default: return theme.palette.error;
    }
  };

  if (variant === 'snackbar') {
    return (
      <Snackbar
        open={!!error}
        autoHideDuration={autoHideDuration}
        onClose={onClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={onClose} 
          severity={severity} 
          sx={{ 
            width: '100%',
            borderRadius: 2,
            boxShadow: `0 8px 32px ${alpha(getColor().main, 0.2)}`,
            '& .MuiAlert-icon': {
              fontSize: 24
            }
          }}
        >
          <Typography variant="body1" fontWeight={600}>
            {title || (severity === 'error' ? 'Error' : severity === 'warning' ? 'Warning' : 'Information')}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {error}
          </Typography>
        </Alert>
      </Snackbar>
    );
  }

  if (variant === 'full-page') {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
        sx={{ textAlign: 'center', p: 4 }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(getColor().main, 0.02)} 100%)`,
            border: `1px solid ${alpha(getColor().main, 0.12)}`,
            boxShadow: `0 8px 32px ${alpha(getColor().main, 0.08)}`,
            textAlign: 'center',
            maxWidth: 480
          }}
        >
          <Stack spacing={3} alignItems="center">
            {showIcon && (
              <Box
                sx={{
                  p: 2,
                  borderRadius: '50%',
                  backgroundColor: alpha(getColor().main, 0.1),
                  border: `2px solid ${alpha(getColor().main, 0.2)}`,
                }}
              >
                {React.cloneElement(getIcon(), {
                  sx: {
                    fontSize: 48,
                    color: getColor().main,
                  }
                })}
              </Box>
            )}
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  mb: 1,
                }}
              >
                {title || (severity === 'error' ? 'Something went wrong' : severity === 'warning' ? 'Warning' : 'Information')}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  lineHeight: 1.6,
                }}
              >
                {error}
              </Typography>
            </Box>
            {onRetry && (
              <Button
                onClick={onRetry}
                variant="contained"
                startIcon={<RefreshIcon />}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: 'none',
                  background: `linear-gradient(135deg, ${getColor().main} 0%, ${getColor().dark} 100%)`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${getColor().dark} 0%, ${getColor().main} 100%)`,
                    transform: 'translateY(-1px)',
                    boxShadow: `0 6px 20px ${alpha(getColor().main, 0.3)}`,
                  }
                }}
              >
                Try Again
              </Button>
            )}
          </Stack>
        </Paper>
      </Box>
    );
  }

  // Default inline variant
  return (
    <Paper
      sx={{
        bgcolor: alpha(getColor().main, 0.05),
        border: `1px solid ${alpha(getColor().main, 0.2)}`,
        borderRadius: 2,
        p: 3,
        mb: 2
      }}
    >
      <Stack direction="row" spacing={2} alignItems="flex-start">
        {showIcon && (
          <Box sx={{ color: getColor().main, mt: 0.25 }}>
            {React.cloneElement(getIcon(), { fontSize: 'small' })}
          </Box>
        )}
        <Box sx={{ flex: 1 }}>
          {title && (
            <Typography 
              variant="subtitle2" 
              sx={{ 
                color: getColor().main, 
                fontWeight: 700,
                mb: 0.5 
              }}
            >
              {title}
            </Typography>
          )}
          <Typography 
            variant="body2" 
            sx={{ 
              color: theme.palette.text.primary,
              lineHeight: 1.5 
            }}
          >
            {error}
          </Typography>
          {onRetry && (
            <Button
              onClick={onRetry}
              size="small"
              startIcon={<RefreshIcon />}
              sx={{
                mt: 2,
                color: getColor().main,
                '&:hover': {
                  backgroundColor: alpha(getColor().main, 0.08),
                }
              }}
            >
              Retry
            </Button>
          )}
        </Box>
        {onClose && (
          <Button
            onClick={onClose}
            size="small"
            sx={{
              minWidth: 'auto',
              p: 0.5,
              color: theme.palette.text.secondary,
              '&:hover': {
                backgroundColor: alpha(theme.palette.text.secondary, 0.08),
              }
            }}
          >
            ×
          </Button>
        )}
      </Stack>
    </Paper>
  );
};

export default ErrorDisplay;
