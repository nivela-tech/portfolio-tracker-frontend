import React from 'react';
import { Paper, Typography, Container, Button } from '@mui/material';
import { AddEntryForm } from '../components/AddEntryForm';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const AddEntryPage: React.FC = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const { user, authLoading, login } = useAuth(); // Corrected: authLoading is directly from useAuth now

  const handleEntryAdded = () => {
    if (accountId) {
        navigate(`/portfolio/${accountId}`);
    } else {
        navigate('/portfolio');
    }
  };
  if (authLoading) {
    return (
        <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <LoadingSpinner variant="component" message="Loading entry form..." />
        </Container>
    );
  }

  if (!user) {
    return (
        <Container sx={{ textAlign: 'center', mt: 5 }}>
            <Typography variant="h5" gutterBottom>
                Add New Portfolio Entry
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
                Please sign in to add entries to your portfolio.
            </Typography>
            <Button variant="contained" color="primary" onClick={login}>
                Sign in with Google
            </Button>
        </Container>
    );
  }

  if (!accountId) {
    return (
        <Container sx={{ textAlign: 'center', mt: 5 }}>
            <Typography variant="h5" color="error">No Account Selected</Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
                Cannot add an entry without a selected account.
            </Typography>
            <Button variant="outlined" onClick={() => navigate('/accounts')}>
                Go to Accounts Page
            </Button>
        </Container>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Add New Entry to Account
      </Typography>
      <AddEntryForm 
        onSuccess={handleEntryAdded} 
        accountId={accountId} // Ensure accountId is passed as string? | undefined
      />
    </Paper>
  );
};
