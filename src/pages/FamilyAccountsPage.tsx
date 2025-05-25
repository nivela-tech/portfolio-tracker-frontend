import React, { useEffect, useState } from 'react';
import {
    Paper,
    Typography,
    Box,
    Alert,
    Snackbar,
    CircularProgress,
    Button,
    Container,
    Fab,
    Dialog,
    Zoom
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { AddAccountForm } from '../components/AddAccountForm';
import { AccountsTable } from '../components/AccountsTable';
import { useNavigate } from 'react-router-dom';
import { PortfolioAccount } from '../types/portfolio';
import { accountApi } from '../services/accountApi';
import { useAuth } from '../components/Layout';

export const FamilyAccountsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading, login } = useAuth();

  const [accounts, setAccounts] = useState<PortfolioAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const loadAccounts = async () => {
    if (!user) {
      setAccounts([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await accountApi.getAllAccounts();
      if (Array.isArray(data)) {
        setAccounts(data);
      } else {
        console.error('Invalid response format for accounts:', data);
        throw new Error('Invalid response format when fetching accounts.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred while fetching accounts.';
      setError(message);
      console.error('Failed to load accounts:', err);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
        loadAccounts();
    } else {
        setAccounts([]);
        setLoading(false);
    }
  }, [user]);

  const handleAccountSelect = (account: PortfolioAccount) => {
    navigate(`/portfolio/${account.id}`);
  };

  const handleAccountAdded = async () => {
    if (!user) return;
    setIsAddDialogOpen(false);
    await loadAccounts();
  };

  const handleCloseError = () => {
    setError(null);
  };

  const handleRetry = () => {
    if (!user) return;
    loadAccounts();
  };

  if (authLoading) {
    return (
        <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <CircularProgress />
        </Container>
    );
  }

  if (!user) {
    return (
        <Container sx={{ textAlign: 'center', mt: 5 }}>
            <Typography variant="h5" gutterBottom>
                Manage Your Accounts
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
                Please sign in to view and manage your accounts.
            </Typography>
            <Button variant="contained" color="primary" onClick={login}>
                Sign in with Google
            </Button>
        </Container>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4, position: 'relative' }}>
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

      <Dialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <AddAccountForm onAccountAdded={handleAccountAdded} />
      </Dialog>

      {user && (
        <Zoom in={true}>
            <Fab 
                color="primary" 
                aria-label="add account" 
                sx={{ position: 'fixed', bottom: 16, right: 16 }} 
                onClick={() => setIsAddDialogOpen(true)}
            >
                <AddIcon />
            </Fab>
        </Zoom>
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Paper>
  );
};
