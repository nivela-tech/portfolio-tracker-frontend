import React from 'react';
import {
  Paper,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Stack,
  Chip,
  LinearProgress,
  alpha
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  Assessment as AssessmentIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { PortfolioEntry } from '../types/portfolio';
import { convertCurrency } from '../utils/currencyConverter';

interface PerformanceDashboardProps {
  entries: PortfolioEntry[];
  selectedCurrency: string;
  totalNetWorth: number;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  entries,
  selectedCurrency,
  totalNetWorth
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Calculate performance metrics
  const calculateMetrics = () => {
    if (!entries || entries.length === 0) {
      return {
        totalAccounts: 0,
        totalEntries: 0,
        averageInvestment: 0,
        largestInvestment: 0,
        diversificationScore: 0,
        currencyBreakdown: {},
        typeBreakdown: {},
        countryBreakdown: {}
      };
    }

    // Basic metrics
    const accountIds = new Set(entries.map(entry => entry.accountId));
    const totalAccounts = accountIds.size;
    const totalEntries = entries.length;
    
    // Convert all amounts to selected currency
    const convertedAmounts = entries.map(entry => 
      convertCurrency(entry.amount, entry.currency, selectedCurrency)
    );
    
    const averageInvestment = convertedAmounts.reduce((sum, amount) => sum + amount, 0) / totalEntries;
    const largestInvestment = Math.max(...convertedAmounts);

    // Diversification calculations
    const currencyBreakdown: Record<string, number> = {};
    const typeBreakdown: Record<string, number> = {};
    const countryBreakdown: Record<string, number> = {};

    entries.forEach(entry => {
      const amount = convertCurrency(entry.amount, entry.currency, selectedCurrency);
      
      currencyBreakdown[entry.currency] = (currencyBreakdown[entry.currency] || 0) + amount;
      typeBreakdown[entry.type] = (typeBreakdown[entry.type] || 0) + amount;
      countryBreakdown[entry.country] = (countryBreakdown[entry.country] || 0) + amount;
    });    // Improved diversification score (0-100)
    const uniqueCurrencies = Object.keys(currencyBreakdown).length;
    const uniqueTypes = Object.keys(typeBreakdown).length;
    const uniqueCountries = Object.keys(countryBreakdown).length;
    
    // More realistic scoring - penalize lack of diversification
    // Perfect diversification would be 5+ currencies, 5+ types, 5+ countries
    const currencyScore = Math.min(100, (uniqueCurrencies / 5) * 100);
    const typeScore = Math.min(100, (uniqueTypes / 5) * 100);
    const countryScore = Math.min(100, (uniqueCountries / 5) * 100);
    
    // Weight the scores: types matter most, then countries, then currencies
    const diversificationScore = Math.round(
      (typeScore * 0.4) + (countryScore * 0.35) + (currencyScore * 0.25)
    );

    return {
      totalAccounts,
      totalEntries,
      averageInvestment,
      largestInvestment,
      diversificationScore,
      currencyBreakdown,
      typeBreakdown,
      countryBreakdown
    };
  };

  const metrics = calculateMetrics();

  const formatCurrency = (amount: number) => {
    const absAmount = Math.abs(amount);
    if (absAmount >= 1000000) {
      return `${selectedCurrency} ${(amount / 1000000).toFixed(1)}M`;
    } else if (absAmount >= 1000) {
      return `${selectedCurrency} ${(amount / 1000).toFixed(0)}K`;
    } else {
      return `${selectedCurrency} ${amount.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })}`;
    }
  };
  const getDiversificationColor = (score: number) => {
    if (score >= 70) return theme.palette.success.main;
    if (score >= 50) return theme.palette.warning.main;
    if (score >= 30) return theme.palette.warning.dark;
    return theme.palette.error.main;
  };

  const getDiversificationLabel = (score: number) => {
    if (score >= 70) return 'Excellent';
    if (score >= 50) return 'Good';
    if (score >= 30) return 'Fair';
    return 'Poor';
  };

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    color?: string;
    progress?: number;
  }> = ({ title, value, subtitle, icon, color, progress }) => (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        height: '100%',
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.15)}`,
          borderColor: alpha(theme.palette.primary.main, 0.2),
        }
      }}
    >
      <Stack spacing={2}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              backgroundColor: alpha(color || theme.palette.primary.main, 0.1),
              color: color || theme.palette.primary.main,
            }}
          >
            {icon}
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: 600,
              letterSpacing: 0.5,
            }}
          >
            {title}
          </Typography>
        </Box>
        
        <Box>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            sx={{
              fontWeight: 700,
              color: color || theme.palette.text.primary,
              lineHeight: 1.1,
            }}
          >
            {value}
          </Typography>
          {subtitle && (
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                mt: 0.5,
                fontWeight: 500,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {progress !== undefined && (
          <Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: alpha(color || theme.palette.primary.main, 0.1),
                '& .MuiLinearProgress-bar': {
                  backgroundColor: color || theme.palette.primary.main,
                  borderRadius: 3,
                }
              }}
            />
          </Box>
        )}
      </Stack>
    </Paper>
  );

  if (!entries || entries.length === 0) {
    return (
      <Paper
        elevation={1}
        sx={{
          p: 4,
          textAlign: 'center',
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
          borderRadius: 3,
          mb: 3,
        }}
      >
        <AssessmentIcon sx={{ fontSize: 48, color: theme.palette.text.secondary, mb: 2 }} />
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600 }}>
          Performance Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Add portfolio entries to see performance metrics and insights
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ mb: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
            }}
          >
            <AssessmentIcon />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
              }}
            >
              Performance Dashboard
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 500,
              }}
            >
              Key metrics and portfolio insights
            </Typography>
          </Box>        </Stack>
      </Box>

      {/* Metrics Grid */}
      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: '1fr 1fr 1fr 1fr'
          },
          gap: 3,
          mb: 3
        }}
      >
        <MetricCard
          title="TOTAL ACCOUNTS"
          value={metrics.totalAccounts}
          subtitle="Active accounts"
          icon={<AccountBalanceIcon />}
          color={theme.palette.primary.main}
        />
        
        <MetricCard
          title="TOTAL ENTRIES"
          value={metrics.totalEntries}
          subtitle="Portfolio positions"
          icon={<PieChartIcon />}
          color={theme.palette.info.main}
        />
        
        <MetricCard
          title="AVERAGE POSITION"
          value={formatCurrency(metrics.averageInvestment)}
          subtitle="Per investment"
          icon={<TimelineIcon />}
          color={theme.palette.success.main}
        />
        
        <MetricCard
          title="LARGEST POSITION"
          value={formatCurrency(metrics.largestInvestment)}
          subtitle="Single investment"
          icon={<TrendingUpIcon />}
          color={theme.palette.warning.main}
        />
      </Box>

      {/* Diversification Score */}
      <Box sx={{ mt: 3 }}>
        <Paper
          elevation={1}
          sx={{
            p: 3,
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
            borderRadius: 3,
          }}
        >
          <Stack direction={isMobile ? "column" : "row"} spacing={3} alignItems="center">
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: alpha(getDiversificationColor(metrics.diversificationScore), 0.1),
                  color: getDiversificationColor(metrics.diversificationScore),
                }}
              >
                <SecurityIcon />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                  }}
                >
                  Diversification Score
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                  }}
                >
                  Portfolio risk distribution
                </Typography>
              </Box>
            </Stack>
            
            <Box sx={{ flex: 1, minWidth: isMobile ? '100%' : 200 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: getDiversificationColor(metrics.diversificationScore),
                  }}
                >
                  {metrics.diversificationScore}%
                </Typography>
                <Chip
                  label={getDiversificationLabel(metrics.diversificationScore)}
                  size="small"
                  sx={{
                    backgroundColor: alpha(getDiversificationColor(metrics.diversificationScore), 0.1),
                    color: getDiversificationColor(metrics.diversificationScore),
                    fontWeight: 600,
                  }}
                />
              </Box>
              <LinearProgress
                variant="determinate"
                value={metrics.diversificationScore}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: alpha(getDiversificationColor(metrics.diversificationScore), 0.1),
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: getDiversificationColor(metrics.diversificationScore),
                    borderRadius: 4,
                  }
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  mt: 1,
                  display: 'block',
                  fontWeight: 500,
                }}              >
                Based on {Object.keys(metrics.currencyBreakdown).length} {Object.keys(metrics.currencyBreakdown).length === 1 ? 'currency' : 'currencies'}, {Object.keys(metrics.typeBreakdown).length} asset {Object.keys(metrics.typeBreakdown).length === 1 ? 'type' : 'types'}, {Object.keys(metrics.countryBreakdown).length} {Object.keys(metrics.countryBreakdown).length === 1 ? 'country' : 'countries'}. 
                {metrics.diversificationScore < 30 && 'Consider diversifying across more asset types and geographical regions.'}
                {metrics.diversificationScore >= 30 && metrics.diversificationScore < 50 && 'Moderate diversification - room for improvement.'}
                {metrics.diversificationScore >= 50 && metrics.diversificationScore < 70 && 'Good diversification across your portfolio.'}
                {metrics.diversificationScore >= 70 && 'Excellent diversification strategy!'}
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default PerformanceDashboard;
