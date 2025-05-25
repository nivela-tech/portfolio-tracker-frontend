import React, { useEffect, useState } from 'react';
import { Paper, Typography, Box, Alert, Snackbar, CircularProgress, Button } from '@mui/material';
import { AddAccountForm } from '../components/AddAccountForm';
import { AccountsTable } from '../components/AccountsTable';
import { useNavigate } from 'react-router-dom';
import { PortfolioAccount } from '../types/portfolio';
import { accountApi } from '../services/accountApi';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import Zoom from '@mui/material/Zoom';

export const FamilyAccountsPage: React.FC = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<PortfolioAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await accountApi.getAllAccounts();
      if (Array.isArray(data)) {
        setAccounts(data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
      console.error('Failed to load accounts:', err);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleAccountSelect = (account: PortfolioAccount) => {
    navigate(`/portfolio/${account.id}`);
  };

  const handleAccountAdded = async () => {
    await loadAccounts(); // Reload the accounts list after adding a new one
  };

  const handleCloseError = () => {
    setError(null);
  };

  const handleRetry = () => {
    loadAccounts();
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Accounts
      </Typography>
      <Box sx={{ mt: 3 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box textAlign="center">
            <Typography color="error" gutterBottom>
              {error}
            </Typography>
            <Button variant="contained" onClick={handleRetry}>
              Retry
            </Button>
          </Box>
        ) : accounts.length === 0 ? (
          <Typography>No accounts found. Create one using the button below.</Typography>
        ) : (
          <AccountsTable 
            accounts={accounts} 
            onSelect={handleAccountSelect}
          />
        )}
      </Box>

      {/* Add Account Dialog */}
      <Dialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <AddAccountForm onAccountAdded={() => {
          setIsAddDialogOpen(false);
          handleAccountAdded();
        }} />
      </Dialog>

      {/* Floating Action Button */}
      <Zoom in={true}>
        <Fab
          color="primary"
          aria-label="add account"
          onClick={() => setIsAddDialogOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000,
            boxShadow: 6,
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.12)',
              boxShadow: 12
            }
          }}
        >
          <AddIcon />
        </Fab>
      </Zoom>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Paper>
  );
};
