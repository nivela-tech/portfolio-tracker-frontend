import React, { useState } from 'react';
import {
    TextField,
    Button,
    Box,
    Typography,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
    Grid,
    CircularProgress,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormHelperText,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { PortfolioAccount } from '../types/portfolio';
import { accountApi } from '../services/accountApi';
import { RELATIONSHIP_TYPES } from '../utils/constants';

interface AddAccountFormProps {
    onAccountAdded: () => void;
    onCancel: () => void; // Added for closing the dialog/modal
}

export const AddAccountForm: React.FC<AddAccountFormProps> = ({ onAccountAdded, onCancel }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [account, setAccount] = useState<Omit<PortfolioAccount, 'id'>>({
        name: '',
        relationship: 'Self' // Default to Self
    });
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
        const target = e.target as { name?: string; value: unknown };
        const name = target.name;
        const value = target.value;

        if (name) {
            setAccount(prev => ({ ...prev, [name]: value as string }));
        }
        if (error) { // Clear error when user starts typing
            setError('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!account.name.trim() || !account.relationship.trim()) {
            setError('Please fill in all fields.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await accountApi.createAccount(account as PortfolioAccount);
            setAccount({ name: '', relationship: 'Self' }); // Reset form
            onAccountAdded(); // Callback to refresh list or close dialog
        } catch (err) {
            console.error('Error adding account:', err);
            setError('Failed to create account. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <DialogTitle>Add New Account</DialogTitle>
            <DialogContent dividers sx={{ paddingTop: '16px !important' }}> {/* Added dividers and padding */}
                <Stack spacing={3}> {/* Increased spacing */}
                    <TextField
                        autoFocus // Focus on the first field
                        margin="dense"
                        id="name"
                        name="name"
                        label="Account Name"
                        type="text"
                        fullWidth
                        variant="outlined" // Standard variant
                        value={account.name}
                        onChange={handleChange}
                        required
                        error={!!error && !account.name.trim()}
                        helperText={!!error && !account.name.trim() ? "Account name is required." : ""}
                    />
                    <FormControl fullWidth variant="outlined" required error={!!error && !account.relationship.trim()}>
                        <InputLabel id="relationship-label">Relationship</InputLabel>
                        <Select
                            labelId="relationship-label"
                            id="relationship"
                            name="relationship"
                            value={account.relationship}
                            onChange={handleChange as any} // Using 'as any' for simplicity with MUI Select's event type
                            label="Relationship"
                        >
                            {RELATIONSHIP_TYPES.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </Select>
                        {!!error && !account.relationship.trim() && (
                             <FormHelperText>Relationship is required.</FormHelperText>
                        )}
                    </FormControl>
                    {error && !(!account.name.trim() || !account.relationship.trim()) && ( // General error message
                        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                            {error}
                        </Typography>
                    )}
                </Stack>
            </DialogContent>            <DialogActions sx={{ 
                padding: isMobile ? '16px' : '16px 24px',
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? 1 : 0
            }}>
                <Button onClick={onCancel} color="inherit" fullWidth={isMobile}>
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    sx={{ minWidth: isMobile ? 'auto' : '120px' }}
                    fullWidth={isMobile}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Add Account'}
                </Button>
            </DialogActions>
        </form>
    );
};
