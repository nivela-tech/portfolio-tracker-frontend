import React, { useState } from 'react';
import { 
  Paper, 
  Box, 
  Typography, 
  Select, 
  MenuItem, 
  useTheme, 
  useMediaQuery,
  Divider,
  IconButton,
  Stack,
  Chip,
  Tooltip
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { CURRENCIES } from '../utils/constants';

interface NetWorthBoxProps {
  totalNetWorth: number;
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
}

export const NetWorthBox: React.FC<NetWorthBoxProps> = ({ 
  totalNetWorth, 
  selectedCurrency, 
  onCurrencyChange 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isHidden, setIsHidden] = useState(false);

  // Format large numbers in a professional way
  const formatCurrency = (amount: number) => {
    if (isHidden) {
      return '***';
    }
    
    const absAmount = Math.abs(amount);
    if (absAmount >= 1000000) {
      return `${selectedCurrency} ${(amount / 1000000).toFixed(2)}M`;
    } else if (absAmount >= 1000) {
      return `${selectedCurrency} ${(amount / 1000).toFixed(1)}K`;
    } else {
      return `${selectedCurrency} ${amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    }
  };

  const formatDetailedCurrency = (amount: number) => {
    if (isHidden) {
      return '*** *** ***';
    }
    
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      style: 'currency',
      currency: selectedCurrency
    });
  };

  const toggleVisibility = () => {
    setIsHidden(!isHidden);
  };

  const getPerformanceColor = () => {
    if (totalNetWorth > 0) return theme.palette.success.main;
    if (totalNetWorth < 0) return theme.palette.error.main;
    return theme.palette.text.secondary;
  };

  return (
    <Paper
      elevation={2}
      sx={{
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: `1px solid ${theme.palette.mode === 'dark' ? '#334155' : '#e5e7eb'}`,
        borderRadius: 3,
        overflow: 'hidden',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        },
      }}
    >
      {/* Header Section */}
      <Box sx={{ p: { xs: 2, md: 3 }, pb: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(59, 130, 246, 0.1)' 
                  : 'rgba(21, 101, 192, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AccountBalanceIcon 
                sx={{ 
                  color: theme.palette.primary.main,
                  fontSize: isMobile ? 20 : 24 
                }}
              />
            </Box>
            <Box>
              <Typography
                variant="overline"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 600,
                  letterSpacing: 1,
                  fontSize: '0.75rem',
                  lineHeight: 1,
                }}
              >
                Total Portfolio Value
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <Chip
                  icon={<TrendingUpIcon sx={{ fontSize: '0.875rem !important' }} />}
                  label="Live"
                  size="small"
                  variant="outlined"
                  sx={{
                    height: 20,
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    borderColor: theme.palette.success.main,
                    color: theme.palette.success.main,
                    '& .MuiChip-icon': {
                      color: theme.palette.success.main,
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>
            <Stack direction="row" spacing={0.5} alignItems="center">
            <Tooltip title={isHidden ? "Show values" : "Hide values"}>
              <IconButton 
                size="small" 
                onClick={toggleVisibility}
                sx={{ 
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    color: theme.palette.primary.main,
                    backgroundColor: theme.palette.primary.main + '0A'
                  }
                }}
              >
                {isHidden ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Box>

      <Divider sx={{ mx: { xs: 2, md: 3 } }} />

      {/* Main Value Section */}
      <Box sx={{ p: { xs: 2, md: 3 }, pt: 2 }}>
        <Stack 
          direction={isMobile ? "column" : "row"} 
          justifyContent="space-between" 
          alignItems={isMobile ? "flex-start" : "center"}
          spacing={isMobile ? 2 : 1}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant={isMobile ? "h4" : "h3"}
              sx={{
                fontWeight: 700,
                color: getPerformanceColor(),
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                fontFeatureSettings: '"tnum"', // Tabular numbers for better alignment
              }}
            >
              {formatCurrency(totalNetWorth)}
            </Typography>
              {/* Professional detailed breakdown */}
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 500,
                mt: 0.5,
                display: 'block',
                fontSize: '0.75rem',
              }}
            >
              {formatDetailedCurrency(totalNetWorth)}
            </Typography>
          </Box>

          {/* Currency Selector */}
          <Box sx={{ 
            minWidth: isMobile ? '100%' : 120,
            display: 'flex',
            justifyContent: isMobile ? 'flex-start' : 'flex-end'
          }}>
            <Select
              size="small"
              value={selectedCurrency}
              onChange={e => onCurrencyChange(e.target.value as string)}
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

        {/* Performance Indicator */}
        <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              Portfolio Status
            </Typography>
            <Chip
              label={totalNetWorth >= 0 ? "Positive" : "Negative"}
              size="small"
              sx={{
                backgroundColor: totalNetWorth >= 0 
                  ? `${theme.palette.success.main}15`
                  : `${theme.palette.error.main}15`,
                color: totalNetWorth >= 0 
                  ? theme.palette.success.main 
                  : theme.palette.error.main,
                fontWeight: 600,
                fontSize: '0.6875rem',
                height: 22,
                border: `1px solid ${totalNetWorth >= 0 
                  ? `${theme.palette.success.main}30`
                  : `${theme.palette.error.main}30`}`,
              }}
            />
          </Stack>
        </Box>
      </Box>
    </Paper>
  );
};

export {};
