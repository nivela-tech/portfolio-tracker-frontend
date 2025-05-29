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
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Zoom,
    Stack,
    IconButton,
    Tooltip,
    useTheme,
    useMediaQuery
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { AddAccountForm } from '../components/AddAccountForm';
import { AccountsTable } from '../components/AccountsTable';
import { useNavigate } from 'react-router-dom';
import { PortfolioAccount } from '../types/portfolio';
import { accountApi } from '../services/accountApi';
import { useAuth } from '../components/Layout';

export const AccountsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, authLoading, login } = useAuth(); // Changed isLoading to authLoading
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [accounts, setAccounts] = useState<PortfolioAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<PortfolioAccount | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
      const message = handleApiError(err);
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
  
  const handleDeleteClick = (account: PortfolioAccount) => {
    setAccountToDelete(account);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!accountToDelete || !user) return;
    
    try {
      setDeleteLoading(true);
      await accountApi.deleteAccount(accountToDelete.id);
      setIsDeleteDialogOpen(false);
      setAccountToDelete(null);
      // Show success message or notification
      await loadAccounts(); // Refresh the accounts list
    } catch (err) {
      const message = handleApiError(err);
      setError(`Failed to delete account: ${message}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setAccountToDelete(null);
  };

  const handleApiError = (err: unknown): string => {
    if (err instanceof Error) {
        return err.message;
    }
    if (typeof err === 'object' && err !== null) {
        return JSON.stringify(err);
    }
    return 'An unexpected error occurred';
  };

  const handleCloseError = () => {
    setError(null);
  };

  const handleRetry = () => {
    if (!user) return;
    loadAccounts();
  };

  const handleExport = async (format: 'xlsx' | 'csv') => {
    if (!user) return;
    try {
        const blob = await accountApi.exportAccounts(format);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `accounts.${format}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    } catch (err) {
        const message = err instanceof Error ? err.message : `Failed to export as ${format}`;
        setError(message);
    }
};

  const renderAccounts = () => {
    if (loading) {
      return <CircularProgress />;
    }

    if (accounts.length === 0) {
      return (
        <Box textAlign="center" mt={3}>
          <Typography variant="h6">No accounts found.</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Create one using the button below.
          </Typography>
          <Button variant="contained" color="primary" onClick={() => setIsAddDialogOpen(true)}>
            Add Account
          </Button>
        </Box>
      );
    }    return (
      <AccountsTable
        accounts={accounts}
        onAccountClick={handleAccountSelect}
        onDeleteAccount={handleDeleteClick}
      />
    );
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
    <Paper elevation={3} sx={{ p: isMobile ? 2 : 3, mb: isMobile ? 2 : 4, position: 'relative' }}>
      <Typography variant={isMobile ? "h6" : "h5"} component="h2" gutterBottom>
        Manage Accounts
      </Typography>
      <Box sx={{ mt: isMobile ? 2 : 3 }}>
        {renderAccounts()}
      </Box>

      <Dialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            margin: isMobile ? 1 : 3,
            width: isMobile ? 'calc(100% - 16px)' : undefined
          }
        }}
      >
        <AddAccountForm onAccountAdded={handleAccountAdded} onCancel={() => setIsAddDialogOpen(false)} />
      </Dialog>

      {user && (
        <Zoom in={true}>
            <Fab 
                color="primary" 
                aria-label="add account" 
                sx={{ 
                  position: 'fixed', 
                  bottom: isMobile ? 16 : 16, 
                  right: isMobile ? 16 : 16,
                  width: isMobile ? 48 : 56,
                  height: isMobile ? 48 : 56
                }} 
                onClick={() => setIsAddDialogOpen(true)}
                size={isMobile ? "medium" : "large"}
            >
                <AddIcon />
            </Fab>
        </Zoom>
      )}{/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Account
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the account "{accountToDelete?.name}"? 
            This will also delete all portfolio entries associated with this account.
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary" disabled={deleteLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error"
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} /> : null}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

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
