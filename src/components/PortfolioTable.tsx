import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip,
    useTheme,
    useMediaQuery,
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Stack,
    Divider,
    Avatar,
    alpha
} from '@mui/material';
import { 
    Edit as EditIcon, 
    Delete as DeleteIcon,
    TrendingUp as TrendingUpIcon,
    AccountBalance as AccountBalanceIcon,
    Public as PublicIcon,
    AttachMoney as AttachMoneyIcon
} from '@mui/icons-material';
import { PortfolioEntry } from '../types/portfolio';

interface PortfolioTableProps {
    entries: PortfolioEntry[];
    showMemberName?: boolean;
    onEdit: (entry: PortfolioEntry) => void;
    onDelete: (entryId: string) => void; // Changed to string
    selectedCurrency: string; // Added selectedCurrency
    loading?: boolean; // Added loading
    showActions?: boolean; // Added to control visibility of Actions column
}

export const PortfolioTable: React.FC<PortfolioTableProps> = ({ 
    entries, 
    showMemberName = false,
    onEdit, 
    onDelete,
    selectedCurrency, // Added selectedCurrency
    loading, // Added loading
    showActions = true // Default to showing actions
}) => {    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    const getTypeIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'investment':
            case 'stocks':
            case 'bonds':
                return <TrendingUpIcon />;
            case 'savings':
            case 'checking':
                return <AccountBalanceIcon />;
            case 'cash':
                return <AttachMoneyIcon />;
            default:
                return <AccountBalanceIcon />;
        }
    };    const getTypeColor = (type: string) => {
        switch (type.toLowerCase()) {
            case 'investment':
            case 'stocks':
                return 'success';
            case 'bonds':
                return 'info';
            case 'savings':
                return 'primary';
            case 'cash':
                return 'warning';
            default:
                return 'primary';
        }
    };

    const getTypeColorValue = (type: string) => {
        const colorKey = getTypeColor(type);
        switch (colorKey) {
            case 'success':
                return theme.palette.success.main;
            case 'info':
                return theme.palette.info.main;
            case 'primary':
                return theme.palette.primary.main;
            case 'warning':
                return theme.palette.warning.main;
            default:
                return theme.palette.primary.main;
        }
    };// Mobile Card View
    if (isMobile) {
        return (
            <Stack spacing={3}>
                {entries.map((entry) => (
                    <Card 
                        key={entry.id} 
                        variant="outlined"
                        sx={{
                            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
                            borderRadius: 3,
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                borderColor: alpha(theme.palette.primary.main, 0.3),
                                boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.12)}`,
                                transform: 'translateY(-2px)',
                            }
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            {/* Header Section */}
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Avatar
                                        sx={{
                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                            color: theme.palette.primary.main,
                                            width: 48,
                                            height: 48,
                                            border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`
                                        }}
                                    >
                                        {getTypeIcon(entry.type)}
                                    </Avatar>
                                    <Box>
                                        <Typography 
                                            variant="h6" 
                                            component="div"
                                            sx={{ 
                                                fontWeight: 600,
                                                color: theme.palette.text.primary,
                                                mb: 0.5
                                            }}
                                        >
                                            {entry.type}
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            color="text.secondary"
                                            sx={{ fontWeight: 500 }}
                                        >
                                            {new Date(entry.dateAdded).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </Typography>
                                    </Box>
                                </Box>
                                {showActions && (
                                    <Box display="flex" gap={1}>
                                        <Tooltip title="Edit Entry">
                                            <IconButton 
                                                onClick={() => onEdit(entry)}
                                                size="small"
                                                sx={{
                                                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                                                    color: theme.palette.primary.main,
                                                    '&:hover': {
                                                        bgcolor: alpha(theme.palette.primary.main, 0.16),
                                                    }
                                                }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete Entry">
                                            <IconButton 
                                                onClick={() => onDelete(entry.id)}
                                                size="small"
                                                sx={{
                                                    bgcolor: alpha(theme.palette.error.main, 0.08),
                                                    color: theme.palette.error.main,
                                                    '&:hover': {
                                                        bgcolor: alpha(theme.palette.error.main, 0.16),
                                                    }
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                )}
                            </Box>
                            
                            {/* Amount Section */}
                            <Box 
                                sx={{ 
                                    bgcolor: alpha(theme.palette.success.main, 0.08),
                                    borderRadius: 2,
                                    p: 2.5,
                                    mb: 3,
                                    border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
                                }}
                            >
                                <Typography 
                                    variant="body2" 
                                    color="text.secondary"
                                    sx={{ mb: 1, fontWeight: 500 }}
                                >
                                    Portfolio Value
                                </Typography>
                                <Typography 
                                    variant="h5" 
                                    sx={{ 
                                        fontWeight: 700,
                                        color: theme.palette.success.main,
                                        fontFamily: 'Inter, sans-serif'
                                    }}
                                >
                                    {formatCurrency(entry.amount, entry.currency)}
                                </Typography>
                            </Box>

                            {/* Details Section */}
                            <Stack spacing={2}>
                                {showMemberName && (
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                            Account Name:
                                        </Typography>
                                        <Typography variant="body2" fontWeight={600}>
                                            {entry.account?.name || 'Unknown'}
                                        </Typography>
                                    </Box>
                                )}
                                
                                <Divider />
                                
                                {/* Tags Section */}
                                <Box>
                                    <Typography 
                                        variant="body2" 
                                        color="text.secondary" 
                                        sx={{ mb: 1.5, fontWeight: 500 }}
                                    >
                                        Investment Details
                                    </Typography>
                                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                        <Chip 
                                            icon={<PublicIcon />}
                                            label={entry.country} 
                                            size="small" 
                                            variant="outlined"
                                            sx={{
                                                borderColor: alpha(theme.palette.info.main, 0.3),
                                                color: theme.palette.info.main,
                                                '& .MuiChip-icon': { color: theme.palette.info.main }
                                            }}
                                        />
                                        <Chip 
                                            label={entry.source} 
                                            size="small" 
                                            variant="outlined"
                                            sx={{
                                                borderColor: alpha(theme.palette.secondary.main, 0.3),
                                                color: theme.palette.secondary.main
                                            }}
                                        />
                                        <Chip 
                                            label={entry.currency} 
                                            size="small" 
                                            color="primary" 
                                            variant="filled"
                                            sx={{ fontWeight: 600 }}
                                        />
                                    </Stack>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                ))}
            </Stack>
        );
    }    // Desktop Table View
    return (
        <TableContainer 
            component={Paper}
            sx={{
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
                boxShadow: `0 4px 24px ${alpha(theme.palette.primary.main, 0.08)}`,
                overflow: 'hidden'
            }}
        >
            <Table>
                <TableHead>
                    <TableRow
                        sx={{
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                            '& .MuiTableCell-head': {
                                color: theme.palette.primary.contrastText,
                                fontWeight: 700,
                                fontSize: '0.875rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                borderBottom: 'none',
                                py: 2.5,
                                '&:first-of-type': {
                                    pl: 3
                                },
                                '&:last-of-type': {
                                    pr: 3
                                }
                            }
                        }}
                    >
                        <TableCell>Date Added</TableCell>
                        {showMemberName && <TableCell>Account Name</TableCell>}
                        <TableCell>Investment Type</TableCell>
                        <TableCell>Currency</TableCell>
                        <TableCell>Portfolio Value</TableCell>
                        <TableCell>Country</TableCell>
                        <TableCell>Source</TableCell>
                        {showActions && (
                            <TableCell align="center">Actions</TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {entries.map((entry, index) => (
                        <TableRow 
                            key={entry.id}
                            sx={{
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                                    transform: 'scale(1.002)',
                                    boxShadow: `inset 0 0 0 1px ${alpha(theme.palette.primary.main, 0.1)}`
                                },
                                '&:nth-of-type(even)': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.02)
                                },
                                '& .MuiTableCell-body': {
                                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                                    py: 2,
                                    '&:first-of-type': {
                                        pl: 3
                                    },
                                    '&:last-of-type': {
                                        pr: 3
                                    }
                                }
                            }}
                        >
                            <TableCell>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Box
                                        sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            bgcolor: theme.palette.success.main,
                                            animation: 'pulse 2s infinite'
                                        }}
                                    />
                                    <Typography variant="body2" fontWeight={600}>
                                        {new Date(entry.dateAdded).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </Typography>
                                </Box>
                            </TableCell>
                            {showMemberName && (
                                <TableCell>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Avatar
                                            sx={{
                                                width: 24,
                                                height: 24,
                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                color: theme.palette.primary.main,
                                                fontSize: '0.75rem'
                                            }}
                                        >
                                            {(entry.account?.name || 'U')[0].toUpperCase()}
                                        </Avatar>
                                        <Typography variant="body2" fontWeight={500}>
                                            {entry.account?.name || 'Unknown'}
                                        </Typography>
                                    </Box>
                                </TableCell>
                            )}
                            <TableCell>
                                <Box display="flex" alignItems="center" gap={1.5}>                                    <Avatar
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            bgcolor: alpha(getTypeColorValue(entry.type), 0.1),
                                            color: getTypeColorValue(entry.type)
                                        }}
                                    >
                                        {getTypeIcon(entry.type)}
                                    </Avatar>
                                    <Typography variant="body2" fontWeight={600}>
                                        {entry.type}
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Chip 
                                    label={entry.currency} 
                                    size="small" 
                                    color="primary" 
                                    variant="filled"
                                    sx={{ 
                                        fontWeight: 600,
                                        minWidth: 60
                                    }}
                                />
                            </TableCell>
                            <TableCell>
                                <Typography 
                                    variant="body1" 
                                    fontWeight={700}
                                    sx={{ 
                                        color: theme.palette.success.main,
                                        fontFamily: 'Inter, sans-serif'
                                    }}
                                >
                                    {formatCurrency(entry.amount, entry.currency)}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Chip 
                                    icon={<PublicIcon />}
                                    label={entry.country} 
                                    size="small" 
                                    variant="outlined"
                                    sx={{
                                        borderColor: alpha(theme.palette.info.main, 0.3),
                                        color: theme.palette.info.main,
                                        '& .MuiChip-icon': { color: theme.palette.info.main }
                                    }}
                                />
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" fontWeight={500}>
                                    {entry.source}
                                </Typography>
                            </TableCell>
                            {showActions && (
                                <TableCell align="center">
                                    <Box display="flex" gap={1} justifyContent="center">
                                        <Tooltip title="Edit Entry">
                                            <IconButton 
                                                onClick={() => onEdit(entry)}
                                                size="small"
                                                sx={{
                                                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                                                    color: theme.palette.primary.main,
                                                    '&:hover': {
                                                        bgcolor: alpha(theme.palette.primary.main, 0.16),
                                                        transform: 'scale(1.1)'
                                                    }
                                                }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete Entry">
                                            <IconButton 
                                                onClick={() => onDelete(entry.id)}
                                                size="small"
                                                sx={{
                                                    bgcolor: alpha(theme.palette.error.main, 0.08),
                                                    color: theme.palette.error.main,
                                                    '&:hover': {
                                                        bgcolor: alpha(theme.palette.error.main, 0.16),
                                                        transform: 'scale(1.1)'
                                                    }
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
