import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Stack,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material';
import {
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { useAuth } from '../components/Layout';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorDisplay } from '../components/ErrorDisplay';
import PerformanceDashboard from '../components/PerformanceDashboard';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { CURRENCIES } from '../utils/constants';
import { useUserPreferences } from '../contexts/UserPreferencesContext';

export const PerformancePage: React.FC = () => {
  const { user, authLoading, login } = useAuth();
  const { preferences } = useUserPreferences();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedCurrency, setSelectedCurrency] = useState(preferences.defaultCurrency);

  // Use combined portfolio data (no accountId)
  const { entries, loading, error } = usePortfolioData();

  const handleCurrencyChange = (event: any) => {
    setSelectedCurrency(event.target.value);
  };

  // Calculate total net worth for all entries
  const calculateTotalNetWorth = () => {
    if (!entries || entries.length === 0) return 0;
    
    // For simplicity, we'll sum all amounts in their original currencies
    // In a real app, you'd want to convert to the selected currency
    return entries.reduce((total, entry) => total + entry.amount, 0);
  };

  if (authLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <LoadingSpinner variant="page" message="Loading performance data..." />
      </Container>
    );
  }

  if (!user) {
    return (
      <Container sx={{ textAlign: 'center', mt: 5 }}>
        <Box sx={{ mb: 4 }}>
          <AssessmentIcon sx={{ fontSize: 64, color: theme.palette.primary.main, mb: 2 }} />
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Performance Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Sign in to view detailed performance metrics and insights for your portfolio.
          </Typography>
          <Box
            onClick={login}
            component="button"
            sx={{
              border: 'none',
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: 'white',
              px: 4,
              py: 2,
              borderRadius: 2,
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
              }
            }}
          >
            Sign in with Google
          </Box>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 3 }}>
        <ErrorDisplay
          error={error}
          variant="full-page"
          severity="error"
          onRetry={() => window.location.reload()}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack 
          direction={isMobile ? "column" : "row"} 
          justifyContent="space-between" 
          alignItems={isMobile ? "flex-start" : "center"} 
          spacing={2}
        >
          <Box>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                }}
              >
                <AssessmentIcon sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    mb: 0.5
                  }}
                >
                  Performance Analytics
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                  }}                >
                  Comprehensive insights and metrics across your entire portfolio
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Currency Selector */}
          <Box sx={{ 
            minWidth: 120,
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
            <Select
              size="small"
              value={selectedCurrency}
              onChange={e => handleCurrencyChange(e)}
              sx={{
                minWidth: 80,
                height: 36,
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(15, 23, 42, 0.5)'
                  : 'rgba(248, 250, 252, 0.8)',
                borderRadius: 2,
                border: `1px solid ${theme.palette.mode === 'dark' ? '#334155' : '#e5e7eb'}`,
                '& .MuiSelect-select': {
                  py: 0.75,
                  px: 1.5,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  border: `2px solid ${theme.palette.primary.main}`,
                },
              }}
              variant="outlined"
            >
              {CURRENCIES.map(currency => (
                <MenuItem 
                  key={currency} 
                  value={currency}
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    py: 1,
                  }}
                >
                  {currency}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Stack>
      </Box>

      {/* Loading State */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <LoadingSpinner variant="component" message="Analyzing your portfolio..." />
        </Box>
      ) : (
        /* Performance Dashboard */
        <PerformanceDashboard
          entries={entries}
          selectedCurrency={selectedCurrency}
          totalNetWorth={calculateTotalNetWorth()}
        />
      )}

      {/* Footer Note */}
      {!loading && entries.length > 0 && (
        <Paper
          elevation={1}
          sx={{
            mt: 4,
            p: 3,
            background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
            border: `1px solid ${alpha(theme.palette.info.main, 0.12)}`,
            borderRadius: 3,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: 500,
              textAlign: 'center',
            }}
          >
            📊 Performance metrics are calculated in real-time based on your portfolio entries. 
            Currency conversions use approximate exchange rates for display purposes.
          </Typography>
        </Paper>
      )}
    </Container>
  );
};
