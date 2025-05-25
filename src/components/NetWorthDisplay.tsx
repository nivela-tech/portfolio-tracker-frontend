import React from 'react';
import {
    Paper,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box
} from '@mui/material';
import { PortfolioEntry } from '../types/portfolio';
import { convertCurrency, AVAILABLE_CURRENCIES } from '../utils/currencyConverter';

interface NetWorthDisplayProps {
    entries: PortfolioEntry[];
    selectedCurrency: string;
    onCurrencyChange: (currency: string) => void;
}

export const NetWorthDisplay: React.FC<NetWorthDisplayProps> = ({
    entries,
    selectedCurrency,
    onCurrencyChange
}) => {
    const calculateNetWorth = () => {
        return entries.reduce((total, entry) => {
            const convertedAmount = convertCurrency(
                entry.amount,
                entry.currency,
                selectedCurrency
            );
            return total + convertedAmount;
        }, 0);
    };

    return (
        <Paper elevation={3} sx={{ p: 2, backgroundColor: '#f5f5f5', height: '100%' }}>
            <Box display="flex" flexDirection="column" gap={2}>
                <Typography variant="h6" component="div">
                    Total Net Worth
                </Typography>
                <FormControl sx={{ minWidth: 120 }} size="small">
                    <InputLabel id="currency-select-label">Currency</InputLabel>
                    <Select
                        labelId="currency-select-label"
                        value={selectedCurrency}
                        label="Currency"
                        onChange={(e) => onCurrencyChange(e.target.value)}
                    >
                        {AVAILABLE_CURRENCIES.map((currency) => (
                            <MenuItem key={currency} value={currency}>
                                {currency}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Typography variant="h4" component="div" sx={{ mt: 2, fontWeight: 'bold' }}>
                {selectedCurrency} {calculateNetWorth().toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}
            </Typography>
        </Paper>
    );
};
