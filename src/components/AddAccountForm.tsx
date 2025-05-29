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
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormHelperText,
    useTheme,
    useMediaQuery,
    Paper,
    Avatar,
    Tooltip,
    IconButton,
    alpha
} from '@mui/material';
import { ErrorDisplay } from './ErrorDisplay';
import {
    AccountBalance as AccountBalanceIcon,
    Person as PersonIcon,
    Close as CloseIcon,
    Add as AddIcon,
    Business as BusinessIcon,
    FamilyRestroom as FamilyIcon
} from '@mui/icons-material';
import { PortfolioAccount } from '../types/portfolio';
import { accountApi } from '../services/accountApi';
import { RELATIONSHIP_TYPES } from '../utils/constants';
import { LoadingSpinner } from './LoadingSpinner';

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
    };    const getRelationshipIcon = (relationship: string) => {
        switch (relationship) {
            case 'Self':
                return <PersonIcon />;
            case 'Spouse':
            case 'Child':
            case 'Parent':
                return <FamilyIcon />;
            case 'Business':
                return <BusinessIcon />;
            default:
                return <AccountBalanceIcon />;
        }
    };

    return (
        <Box sx={{ maxWidth: 500, mx: 'auto' }}>
            <form onSubmit={handleSubmit}>
                {/* Professional Header */}
                <Paper
                    sx={{
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        color: theme.palette.primary.contrastText,
                        p: 3,
                        borderRadius: '12px 12px 0 0',
                        position: 'relative'
                    }}
                >
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box display="flex" alignItems="center" gap={2}>
                            <Avatar
                                sx={{
                                    bgcolor: alpha(theme.palette.primary.contrastText, 0.15),
                                    color: theme.palette.primary.contrastText,
                                    width: 48,
                                    height: 48
                                }}
                            >
                                <AccountBalanceIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
                                    Create New Account
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    Set up a new portfolio account
                                </Typography>
                            </Box>
                        </Box>
                        <Tooltip title="Close">
                            <IconButton
                                onClick={onCancel}
                                sx={{
                                    color: theme.palette.primary.contrastText,
                                    '&:hover': {
                                        bgcolor: alpha(theme.palette.primary.contrastText, 0.1)
                                    }
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Paper>

                {/* Form Content */}
                <Paper
                    sx={{
                        p: 4,
                        borderRadius: '0 0 12px 12px',
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
                        borderTop: 'none'
                    }}
                >
                    <Stack spacing={3}>
                        {/* Account Name Field */}
                        <TextField
                            autoFocus
                            id="name"
                            name="name"
                            label="Account Name"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={account.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g., My Main Portfolio, Savings Account..."
                            error={!!error && !account.name.trim()}
                            helperText={!!error && !account.name.trim() ? "Account name is required." : ""}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover': {
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: alpha(theme.palette.primary.main, 0.5)
                                        }
                                    }
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <Box sx={{ mr: 1, display: 'flex', color: theme.palette.primary.main }}>
                                        <AccountBalanceIcon />
                                    </Box>
                                )
                            }}
                        />

                        {/* Relationship Field */}
                        <FormControl 
                            fullWidth 
                            variant="outlined" 
                            required 
                            error={!!error && !account.relationship.trim()}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover': {
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: alpha(theme.palette.secondary.main, 0.5)
                                        }
                                    }
                                }
                            }}
                        >
                            <InputLabel id="relationship-label">Account Relationship</InputLabel>
                            <Select
                                labelId="relationship-label"
                                id="relationship"
                                name="relationship"
                                value={account.relationship}
                                onChange={handleChange as any}
                                label="Account Relationship"
                                startAdornment={
                                    <Box sx={{ mr: 1, display: 'flex', color: theme.palette.secondary.main }}>
                                        {getRelationshipIcon(account.relationship)}
                                    </Box>
                                }
                            >
                                {RELATIONSHIP_TYPES.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            {getRelationshipIcon(type)}
                                            {type}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                            {!!error && !account.relationship.trim() && (
                                <FormHelperText>Relationship is required.</FormHelperText>
                            )}
                        </FormControl>                        {/* Error Message */}
                        {error && !(!account.name.trim() || !account.relationship.trim()) && (
                            <ErrorDisplay
                                error={error}
                                variant="inline"
                                severity="error"
                                showIcon={true}
                            />
                        )}

                        {/* Action Buttons */}
                        <Stack 
                            direction={isMobile ? "column" : "row"} 
                            spacing={2} 
                            justifyContent="flex-end"
                            sx={{ mt: 3 }}
                        >
                            <Button 
                                onClick={onCancel} 
                                variant="outlined"
                                size="large"
                                fullWidth={isMobile}
                                sx={{
                                    borderRadius: 2,
                                    py: 1.5,
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    borderColor: alpha(theme.palette.text.secondary, 0.3),
                                    color: theme.palette.text.secondary,
                                    '&:hover': {
                                        borderColor: theme.palette.text.secondary,
                                        bgcolor: alpha(theme.palette.text.secondary, 0.04)
                                    }
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth={isMobile}
                                disabled={loading}
                                startIcon={loading ? <LoadingSpinner variant="minimal" size="small" /> : <AddIcon />}
                                sx={{
                                    borderRadius: 2,
                                    py: 1.5,
                                    px: 4,
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    textTransform: 'none',
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                                    '&:hover': {
                                        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                                        boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                                        transform: 'translateY(-1px)'
                                    },
                                    '&:disabled': {
                                        background: alpha(theme.palette.primary.main, 0.6),
                                        color: alpha(theme.palette.primary.contrastText, 0.7)
                                    }
                                }}                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </Button>
                        </Stack>
                    </Stack>
                </Paper>
            </form>
        </Box>
    );
};
