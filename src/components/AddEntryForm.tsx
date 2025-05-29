import React, { useEffect, useState } from 'react';
import {
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Box,
    Stack,
    useTheme,
    useMediaQuery,
    Typography,
    Paper,
    Divider,
    IconButton,
    Tooltip,
    alpha,
    Avatar
} from '@mui/material';
import {
    TrendingUp as TrendingUpIcon,
    AccountBalance as AccountBalanceIcon,
    AttachMoney as AttachMoneyIcon,
    Public as PublicIcon,
    Business as BusinessIcon,
    Close as CloseIcon,
    Save as SaveIcon,
    Edit as EditIcon
} from '@mui/icons-material';
import { PortfolioEntry } from '../types/portfolio';
import { PORTFOLIO_TYPES, CURRENCIES, COUNTRIES } from '../utils/constants';

interface AddEntryFormProps {
    onSubmit?: (entry: PortfolioEntry) => void; // Renamed from onAddEntry
    onSuccess?: () => void; // Renamed from onEntryAdded
    onCancel?: () => void;
    accountId?: string; // Changed to optional and string
    entry?: PortfolioEntry | null;
    isEdit?: boolean;
    user?: { email?: string }; // Added user prop
    inDialog?: boolean; // New prop to indicate if form is in a dialog
}

export const AddEntryForm: React.FC<AddEntryFormProps> = ({
    onSubmit,
    onSuccess, // Renamed from onEntryAdded
    onCancel,
    accountId,
    entry,
    isEdit = false,
    user, // Destructure user prop
    inDialog = false // Destructure inDialog prop with default false
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [formData, setFormData] = useState<Partial<PortfolioEntry>>({
        type: 'STOCK',
        currency: 'USD',
        amount: 0,
        country: 'Singapore',
        source: '',
        notes: '',
        dateAdded: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (entry) {
            setFormData({
                ...entry,
                dateAdded: entry.dateAdded.split('T')[0]
            });
        }
    }, [entry]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const entryData = {
            ...formData,
            id: entry?.id || '',
            accountId: accountId || '',
            dateAdded: formData.dateAdded ? `${formData.dateAdded}T00:00:00` : new Date().toISOString(),
        } as PortfolioEntry;

        if (onSubmit) {
            onSubmit(entryData);
        }
        if (onSuccess) {
            onSuccess();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev: Partial<PortfolioEntry>) => ({ ...prev, [name]: value }));
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'STOCK':
            case 'BONDS':
                return <TrendingUpIcon />;
            case 'SAVINGS':
            case 'CHECKING':
                return <AccountBalanceIcon />;
            case 'CASH':
                return <AttachMoneyIcon />;
            default:
                return <BusinessIcon />;
        }
    };

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2        }).format(amount);
    };    return inDialog ? (
        // Dialog Mode - Use proper Dialog components
        <form onSubmit={handleSubmit}>
            <DialogTitle sx={{ 
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: theme.palette.primary.contrastText,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                py: 2
            }}>
                <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                        sx={{
                            bgcolor: alpha(theme.palette.primary.contrastText, 0.15),
                            color: theme.palette.primary.contrastText,
                            width: 40,
                            height: 40
                        }}
                    >
                        {isEdit ? <EditIcon /> : getTypeIcon(formData.type || 'STOCK')}
                    </Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight={700}>
                            {isEdit ? 'Edit Portfolio Entry' : 'Add New Investment'}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.875rem' }}>
                            {isEdit ? 'Update your investment details' : 'Enter your investment information below'}
                        </Typography>
                    </Box>
                </Box>
                {onCancel && (
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
                )}
            </DialogTitle>
            
            <DialogContent sx={{ pt: 3 }}>
                {/* Investment Preview Card */}
                {formData.amount && Number(formData.amount) > 0 && (
                    <Paper
                        sx={{
                            bgcolor: alpha(theme.palette.success.main, 0.05),
                            border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                            borderRadius: 2,
                            p: 3,
                            mb: 3
                        }}
                    >
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Investment Preview
                        </Typography>
                        <Typography variant="h4" color="success.main" fontWeight={700}>
                            {formatCurrency(Number(formData.amount) || 0, formData.currency || 'USD')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {formData.type?.replace('_', ' ')} • {formData.country} • {formData.currency}
                        </Typography>
                    </Paper>
                )}

                <Stack spacing={3}>
                    {/* Investment Type & Amount Row */}
                    <Stack direction={isMobile ? "column" : "row"} spacing={3}>
                        <TextField
                            name="type"
                            select
                            label="Investment Type"
                            value={formData.type || 'STOCK'}
                            onChange={handleChange}
                            fullWidth
                            required
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
                        >
                            {PORTFOLIO_TYPES.map((type) => (
                                <MenuItem key={type} value={type}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        {getTypeIcon(type)}
                                        {type.replace('_', ' ')}
                                    </Box>
                                </MenuItem>
                            ))}
                        </TextField>
                        
                        <TextField
                            name="amount"
                            type="number"
                            label="Investment Amount"
                            value={formData.amount || ''}
                            onChange={handleChange}
                            fullWidth
                            required
                            inputProps={{ 
                                min: 0, 
                                step: 0.01,
                                style: { fontSize: '1.1rem', fontWeight: 600 }
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover': {
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: alpha(theme.palette.success.main, 0.5)
                                        }
                                    }
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <Box sx={{ mr: 1, display: 'flex', color: theme.palette.success.main }}>
                                        <AttachMoneyIcon />
                                    </Box>
                                )
                            }}
                        />
                    </Stack>

                    {/* Currency & Country Row */}
                    <Stack direction={isMobile ? "column" : "row"} spacing={3}>
                        <TextField
                            name="currency"
                            select
                            label="Currency"
                            value={formData.currency || 'USD'}
                            onChange={handleChange}
                            fullWidth
                            required
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2
                                }
                            }}
                        >
                            {CURRENCIES.map((currency) => (
                                <MenuItem key={currency} value={currency}>
                                    {currency}
                                </MenuItem>
                            ))}
                        </TextField>
                        
                        <TextField
                            name="country"
                            select
                            label="Country"
                            value={formData.country || 'Singapore'}
                            onChange={handleChange}
                            fullWidth
                            required
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <Box sx={{ mr: 1, display: 'flex', color: theme.palette.info.main }}>
                                        <PublicIcon />
                                    </Box>
                                )
                            }}
                        >
                            {COUNTRIES.map((country) => (
                                <MenuItem key={country} value={country}>
                                    {country}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Stack>

                    {/* Source & Date Row */}
                    <Stack direction={isMobile ? "column" : "row"} spacing={3}>
                        <TextField
                            name="source"
                            label="Investment Source"
                            value={formData.source || ''}
                            onChange={handleChange}
                            fullWidth
                            placeholder="e.g., Bank Name, Broker, Platform"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <Box sx={{ mr: 1, display: 'flex', color: theme.palette.secondary.main }}>
                                        <BusinessIcon />
                                    </Box>
                                )
                            }}
                        />
                        
                        <TextField
                            name="dateAdded"
                            type="date"
                            label="Investment Date"
                            value={formData.dateAdded || new Date().toISOString().split('T')[0]}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2
                                }
                            }}
                        />
                    </Stack>

                    {/* Notes */}
                    <TextField
                        name="notes"
                        label="Investment Notes (Optional)"
                        value={formData.notes || ''}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="Add any additional notes about this investment..."
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                            }
                        }}
                    />
                </Stack>
            </DialogContent>
              <DialogActions sx={{ p: 3, pt: 2, gap: 2 }}>
                {onCancel && (
                    <Button 
                        onClick={onCancel} 
                        variant="outlined"
                        size="large"
                        sx={{
                            borderRadius: 2,
                            py: 1.2,
                            px: 3,
                            fontWeight: 600,
                            textTransform: 'none',
                            borderColor: alpha(theme.palette.text.secondary, 0.3),
                            color: theme.palette.text.secondary,
                            minWidth: 100,
                            '&:hover': {
                                borderColor: theme.palette.text.secondary,
                                bgcolor: alpha(theme.palette.text.secondary, 0.04)
                            }
                        }}
                    >
                        Cancel
                    </Button>
                )}
                <Button 
                    type="submit" 
                    variant="contained"
                    size="large"
                    startIcon={<SaveIcon />}
                    sx={{
                        borderRadius: 2,
                        py: 1.2,
                        px: 4,
                        fontWeight: 600,
                        fontSize: '1rem',
                        textTransform: 'none',
                        minWidth: 140,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                        '&:hover': {
                            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                            boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                            transform: 'translateY(-1px)'
                        }
                    }}
                >
                    {isEdit ? 'Update Investment' : 'Add Investment'}
                </Button>
            </DialogActions>
        </form>
    ) : (
        // Standalone Mode - Original styling
        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
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
                                {isEdit ? <EditIcon /> : getTypeIcon(formData.type || 'STOCK')}
                            </Avatar>
                            <Box>
                                <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
                                    {isEdit ? 'Edit Portfolio Entry' : 'Add New Investment'}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    {isEdit ? 'Update your investment details' : 'Enter your investment information below'}
                                </Typography>
                            </Box>
                        </Box>
                        {onCancel && (
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
                        )}
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
                    {/* Investment Preview Card */}
                    {formData.amount && Number(formData.amount) > 0 && (
                        <Paper
                            sx={{
                                bgcolor: alpha(theme.palette.success.main, 0.05),
                                border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                                borderRadius: 2,
                                p: 3,
                                mb: 3
                            }}
                        >
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Investment Preview
                            </Typography>
                            <Typography variant="h4" color="success.main" fontWeight={700}>
                                {formatCurrency(Number(formData.amount) || 0, formData.currency || 'USD')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {formData.type?.replace('_', ' ')} • {formData.country} • {formData.currency}
                            </Typography>
                        </Paper>
                    )}

                    <Stack spacing={3}>
                        {/* Investment Type & Amount Row */}
                        <Stack direction={isMobile ? "column" : "row"} spacing={3}>                            <TextField
                                name="type"
                                select
                                label="Investment Type"
                                value={formData.type || 'STOCK'}
                                onChange={handleChange}
                                fullWidth
                                required
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
                            >
                                {PORTFOLIO_TYPES.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            {getTypeIcon(type)}
                                            {type.replace('_', ' ')}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </TextField>
                            
                            <TextField
                                name="amount"
                                type="number"
                                label="Investment Amount"
                                value={formData.amount || ''}
                                onChange={handleChange}
                                fullWidth
                                required
                                inputProps={{ 
                                    min: 0, 
                                    step: 0.01,
                                    style: { fontSize: '1.1rem', fontWeight: 600 }
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        '&:hover': {
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: alpha(theme.palette.success.main, 0.5)
                                            }
                                        }
                                    }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <Box sx={{ mr: 1, display: 'flex', color: theme.palette.success.main }}>
                                            <AttachMoneyIcon />
                                        </Box>
                                    )
                                }}
                            />
                        </Stack>

                        {/* Currency & Country Row */}
                        <Stack direction={isMobile ? "column" : "row"} spacing={3}>
                            <TextField
                                name="currency"
                                select
                                label="Currency"
                                value={formData.currency || 'USD'}
                                onChange={handleChange}
                                fullWidth
                                required
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2
                                    }
                                }}
                            >
                                {CURRENCIES.map((currency) => (
                                    <MenuItem key={currency} value={currency}>
                                        {currency}
                                    </MenuItem>
                                ))}
                            </TextField>
                            
                            <TextField
                                name="country"
                                select
                                label="Country"
                                value={formData.country || 'Singapore'}
                                onChange={handleChange}
                                fullWidth
                                required
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2
                                    }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <Box sx={{ mr: 1, display: 'flex', color: theme.palette.info.main }}>
                                            <PublicIcon />
                                        </Box>
                                    )
                                }}
                            >
                                {COUNTRIES.map((country) => (
                                    <MenuItem key={country} value={country}>
                                        {country}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Stack>

                        {/* Source & Date Row */}
                        <Stack direction={isMobile ? "column" : "row"} spacing={3}>
                            <TextField
                                name="source"
                                label="Investment Source"
                                value={formData.source || ''}
                                onChange={handleChange}
                                fullWidth
                                placeholder="e.g., Bank Name, Broker, Platform"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2
                                    }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <Box sx={{ mr: 1, display: 'flex', color: theme.palette.secondary.main }}>
                                            <BusinessIcon />
                                        </Box>
                                    )
                                }}
                            />
                            
                            <TextField
                                name="dateAdded"
                                type="date"
                                label="Investment Date"
                                value={formData.dateAdded || new Date().toISOString().split('T')[0]}
                                onChange={handleChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2
                                    }
                                }}
                            />
                        </Stack>

                        {/* Notes */}
                        <TextField
                            name="notes"
                            label="Investment Notes (Optional)"
                            value={formData.notes || ''}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={3}
                            placeholder="Add any additional notes about this investment..."
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2
                                }
                            }}
                        />

                        <Divider sx={{ my: 2 }} />

                        {/* Action Buttons */}
                        <Stack 
                            direction={isMobile ? "column" : "row"} 
                            spacing={2} 
                            justifyContent="flex-end"
                        >
                            {onCancel && (
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
                            )}
                            <Button 
                                type="submit" 
                                variant="contained"
                                size="large"
                                fullWidth={isMobile}
                                startIcon={<SaveIcon />}
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
                                    }
                                }}
                            >
                                {isEdit ? 'Update Investment' : 'Add Investment'}
                            </Button>
                        </Stack>
                    </Stack>
                </Paper>
            </form>
        </Box>
    );
};
