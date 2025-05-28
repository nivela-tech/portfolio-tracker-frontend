import React from 'react';
import { Paper, Box, Typography, List, ListItem, ListItemText, ListItemButton, Divider } from '@mui/material';
import { PortfolioAccount } from '../types/portfolio';

interface AccountListProps {
  accounts: PortfolioAccount[];
  selectedCurrency: string;
  calculateAccountNetWorth: (accountId: string) => number; // Changed to string
  onAccountClick: (accountId: string) => void; // Changed to string
}

export const AccountList: React.FC<AccountListProps> = ({
  accounts,
  selectedCurrency,
  calculateAccountNetWorth,
  onAccountClick
}) => (
  <Paper elevation={2} sx={{ mt: 3, borderRadius: 2, overflow: 'hidden' }}>
    <Box sx={{ p: 2, bgcolor: 'background.default' }}>
      <Typography variant="subtitle1" fontWeight="medium" color="text.secondary">
        Accounts
      </Typography>
    </Box>
    <Divider />
    <List disablePadding>
      {accounts.map(acc => {
        const accountNetWorth = calculateAccountNetWorth(acc.id);
        return (
          <React.Fragment key={`${acc.id}-${selectedCurrency}`}>
            <ListItemButton onClick={() => onAccountClick(acc.id)}>
              <ListItemText primary={acc.name} secondary={acc.relationship} />
              <Typography variant="body2" color="primary" fontWeight="medium">
                {selectedCurrency} {accountNetWorth.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </Typography>
            </ListItemButton>
            <Divider component="li" />
          </React.Fragment>
        );
      })}
      {accounts.length === 0 && (
        <ListItem sx={{ py: 2 }}>
          <ListItemText primary="No accounts found" />
        </ListItem>
      )}
    </List>
  </Paper>
);
