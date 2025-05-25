import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { PortfolioAccount } from '../types/portfolio';
import { accountApi } from '../services/accountApi';

interface AddAccountFormProps {
    onAccountAdded: () => void;
}

export const AddAccountForm: React.FC<AddAccountFormProps> = ({ onAccountAdded }) => {
    const [account, setAccount] = useState<Omit<PortfolioAccount, 'id'>>({
        name: '',
        relationship: ''
    });
    const [error, setError] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!account.name || !account.relationship) {
            setError('Please fill in all fields');
            return;
        }
        
        try {
            await accountApi.createAccount(account as PortfolioAccount);
            setError('');
            setAccount({ name: '', relationship: '' });
            onAccountAdded();
        } catch (error) {
            console.error('Error adding account:', error);
            setError('Failed to create account. Please try again.');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ '& > *': { mb: 2 } }}>
            <TextField
                fullWidth
                label="Account Name"
                name="name"
                value={account.name}
                onChange={(e) => setAccount({ ...account, name: e.target.value })}
                required
                error={!!error && !account.name}
                sx={{ mb: 2 }}
            />
            <TextField
                fullWidth
                label="Relationship"
                name="relationship"
                value={account.relationship}
                onChange={(e) => setAccount({ ...account, relationship: e.target.value })}
                required
                error={!!error && !account.relationship}
                sx={{ mb: 2 }}
            />
            {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}
            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
            >
                Add Account
            </Button>
        </Box>
    );
};
