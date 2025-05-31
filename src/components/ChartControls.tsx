import React from 'react';
import { 
  Box, 
  Typography, 
  ToggleButtonGroup, 
  ToggleButton, 
  useTheme, 
  useMediaQuery, 
  Stack,
  Paper,
  alpha,
  Divider
} from '@mui/material';
import { 
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Category as CategoryIcon,
  AttachMoney as CurrencyIcon,
  Public as CountryIcon,
  Source as SourceIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';

interface ChartControlsProps {
  chartType: 'pie' | 'bar';
  groupBy: 'type' | 'currency' | 'country' | 'source';
  setChartType: (type: 'pie' | 'bar') => void;
  setGroupBy: (group: 'type' | 'currency' | 'country' | 'source') => void;
}

export const ChartControls: React.FC<ChartControlsProps> = ({ chartType, groupBy, setChartType, setGroupBy }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const getGroupByIcon = (value: string) => {
    switch (value) {
      case 'type': return <CategoryIcon sx={{ fontSize: 18 }} />;
      case 'currency': return <CurrencyIcon sx={{ fontSize: 18 }} />;
      case 'country': return <CountryIcon sx={{ fontSize: 18 }} />;
      case 'source': return <SourceIcon sx={{ fontSize: 18 }} />;
      default: return <CategoryIcon sx={{ fontSize: 18 }} />;
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
        borderRadius: 3,
        p: { xs: 2, md: 3 },
        mb: 3,
        boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.06)}`,
        overflow: 'hidden',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        },
      }}
    >
      {/* Header Section */}
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              backgroundColor: theme.palette.mode === 'dark' 
                ? 'rgba(59, 130, 246, 0.1)' 
                : 'rgba(21, 101, 192, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AnalyticsIcon 
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
              color: theme.palette.text.primary,
              letterSpacing: '-0.01em',
            }}
          >
            Chart Analytics
          </Typography>
        </Stack>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontWeight: 500,
            fontSize: '0.875rem',
          }}
        >
          Customize your portfolio visualization
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Controls Section */}
      <Stack 
        direction={isMobile ? "column" : "row"} 
        spacing={isMobile ? 3 : 4} 
        alignItems={isMobile ? "stretch" : "flex-start"}
      >        {/* Chart Type Section - Compact */}
        <Box sx={{ flex: isMobile ? 'none' : 1 }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              fontWeight: 600,
              color: theme.palette.text.primary,
              mb: 1,
              letterSpacing: '0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Box
              sx={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                bgcolor: theme.palette.primary.main,
              }}
            />
            Chart Type
          </Typography>
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={(e, value) => value && setChartType(value)}
            size="small"
            fullWidth={isMobile}
            sx={{
              '& .MuiToggleButtonGroup-grouped': {
                borderRadius: '8px !important',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                margin: '0 2px',
                px: 2,
                py: 0.75,
                minHeight: 36,
                fontWeight: 600,
                transition: 'all 0.2s ease-in-out',
                '&:not(:first-of-type)': {
                  borderLeft: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  marginLeft: '4px !important',
                },
                '&.Mui-selected': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  color: theme.palette.primary.contrastText,
                  border: `1px solid ${theme.palette.primary.main}`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                  },
                },
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  transform: 'translateY(-1px)',
                  boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.12)}`,
                },
              },
            }}
          >
            <ToggleButton value="pie">
              <Stack direction="row" alignItems="center" spacing={0.75}>
                <PieChartIcon sx={{ fontSize: 18 }} />
                <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.8rem' }}>
                  Pie Chart
                </Typography>
              </Stack>
            </ToggleButton>
            <ToggleButton value="bar">
              <Stack direction="row" alignItems="center" spacing={0.75}>
                <BarChartIcon sx={{ fontSize: 18 }} />
                <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.8rem' }}>
                  Bar Chart
                </Typography>
              </Stack>
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {!isMobile && (
          <Divider 
            orientation="vertical" 
            flexItem 
            sx={{ 
              mx: 2,
              borderColor: alpha(theme.palette.primary.main, 0.12) 
            }} 
          />
        )}        {/* Group By Section - Compact */}
        <Box sx={{ flex: isMobile ? 'none' : 2 }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              fontWeight: 600,
              color: theme.palette.text.primary,
              mb: 1,
              letterSpacing: '0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Box
              sx={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                bgcolor: theme.palette.secondary.main,
              }}
            />
            Group Analysis By
          </Typography>          <ToggleButtonGroup
            value={groupBy}
            exclusive
            onChange={(e, value) => value && setGroupBy(value)}
            size="small"
            orientation={isMobile ? "vertical" : "horizontal"}
            fullWidth={isMobile}
            sx={{
              display: 'flex',
              flexWrap: 'nowrap',
              '& .MuiToggleButtonGroup-grouped': {
                borderRadius: '8px !important',
                border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                margin: '0 1px',
                px: 1.25,
                py: 0.75,
                minHeight: 36,
                flex: isMobile ? 'none' : 1,
                fontWeight: 600,
                transition: 'all 0.2s ease-in-out',
                '&:not(:first-of-type)': {
                  borderLeft: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                  marginLeft: isMobile ? '0 !important' : '2px !important',
                  marginTop: isMobile ? '2px !important' : '0 !important',
                },
                '&.Mui-selected': {
                  background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
                  color: theme.palette.secondary.contrastText,
                  border: `1px solid ${theme.palette.secondary.main}`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.main} 100%)`,
                  },
                },
                '&:hover': {
                  backgroundColor: alpha(theme.palette.secondary.main, 0.08),
                  transform: 'translateY(-1px)',
                  boxShadow: `0 2px 8px ${alpha(theme.palette.secondary.main, 0.12)}`,
                },
              },
            }}
          >            <ToggleButton value="type">
              <Stack direction="row" alignItems="center" spacing={0.75}>
                {getGroupByIcon('type')}
                <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.8rem' }}>
                  Type
                </Typography>
              </Stack>
            </ToggleButton>
            <ToggleButton value="currency">
              <Stack direction="row" alignItems="center" spacing={0.75}>
                {getGroupByIcon('currency')}
                <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.8rem' }}>
                  Currency
                </Typography>
              </Stack>
            </ToggleButton>
            <ToggleButton value="country">
              <Stack direction="row" alignItems="center" spacing={0.75}>
                {getGroupByIcon('country')}
                <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.8rem' }}>
                  Country
                </Typography>
              </Stack>
            </ToggleButton>
            <ToggleButton value="source">
              <Stack direction="row" alignItems="center" spacing={0.75}>
                {getGroupByIcon('source')}
                <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.8rem' }}>
                  Source
                </Typography>
              </Stack>
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Stack>
    </Paper>
  );
};

export {};
