import React from 'react';
import { Paper, Box, Typography, Select, MenuItem } from '@mui/material';
import { CURRENCIES } from '../utils/constants';

interface NetWorthBoxProps {
  totalNetWorth: number;
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
}

export const NetWorthBox: React.FC<NetWorthBoxProps> = ({ totalNetWorth, selectedCurrency, onCurrencyChange }) => (
  <Paper
    elevation={2}
    sx={(theme) => ({
      p: 2.5,
      borderRadius: 2,
      background: theme.palette.mode === 'dark' ? theme.palette.background.default : 'linear-gradient(145deg, #ffffff, #f5f5f5)',
    })}
  >
    <Box display="flex" flexDirection="column" gap={1.5}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          variant="subtitle1"
          fontWeight="medium"
          color="text.secondary"
          sx={{ letterSpacing: '0.5px' }}
        >
          Total Net Worth
        </Typography>
        <Select
          size="small"
          value={selectedCurrency}
          onChange={e => onCurrencyChange(e.target.value as string)}
          sx={{
            minWidth: 80,
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
      <Typography
        variant="h4"
        component="div"
        fontWeight="bold"
        color="primary.main"
        sx={{ letterSpacing: '-0.5px' }}
      >
        {selectedCurrency} {totalNetWorth.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}
      </Typography>
    </Box>
  </Paper>
);

export {};
