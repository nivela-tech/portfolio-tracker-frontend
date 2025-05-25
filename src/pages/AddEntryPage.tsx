import React from 'react';
import { Paper, Typography } from '@mui/material';
import { AddEntryForm } from '../components/AddEntryForm';
import { useParams, useNavigate } from 'react-router-dom';

export const AddEntryPage: React.FC = () => {
  const { accountId } = useParams();
  const navigate = useNavigate();

  const handleEntryAdded = () => {
    navigate(`/portfolio/${accountId}`);
  };

  if (!accountId) {
    return <Typography color="error">No account selected</Typography>;
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Add New Entry
      </Typography>
      <AddEntryForm onEntryAdded={handleEntryAdded} accountId={parseInt(accountId)} />
    </Paper>
  );
};
