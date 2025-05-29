import React from 'react';
import { Paper, Box, Typography, Select, MenuItem, useTheme, useMediaQuery } from '@mui/material';
import { CURRENCIES } from '../utils/constants';

interface NetWorthBoxProps {
  totalNetWorth: number;
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
}

export const NetWorthBox: React.FC<NetWorthBoxProps> = ({ totalNetWorth, selectedCurrency, onCurrencyChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Paper
      elevation={2}
      sx={(theme) => ({
        p: isMobile ? 2 : 2.5,
        borderRadius: 2,
        background: theme.palette.mode === 'dark' ? theme.palette.background.default : 'linear-gradient(145deg, #ffffff, #f5f5f5)',
        mb: isMobile ? 2 : 3,
      })}
    >
      <Box display="flex" flexDirection={isMobile ? "column" : "row"} justifyContent="space-between" alignItems={isMobile ? "stretch" : "center"} gap={isMobile ? 1.5 : 0}>
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight="medium"
            color="text.secondary"
            sx={{ letterSpacing: '0.5px', fontSize: isMobile ? '0.9rem' : undefined }}
          >
            Total Net Worth
          </Typography>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            component="div"
            fontWeight="bold"
            color="primary.main"
            sx={{ 
              letterSpacing: '-0.5px',
              fontSize: isMobile ? '1.5rem' : undefined,
              wordBreak: 'break-word'
            }}
          >
            {selectedCurrency} {totalNetWorth.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </Typography>
        </Box>
        <Select
          size="small"
          value={selectedCurrency}
          onChange={e => onCurrencyChange(e.target.value as string)}
          sx={{
            minWidth: 80,
            alignSelf: isMobile ? "flex-end" : "center",
            '.MuiSelect-select': {
              py: 0.5,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center'
            }
          }}
          variant="outlined"
        >
          {CURRENCIES.map(currency => (
            <MenuItem key={currency} value={currency}>
              {currency}
            </MenuItem>
          ))}
        </Select>
      </Box>
    </Paper>
  );
};

export {};
