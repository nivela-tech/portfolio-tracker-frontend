import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    IconButton,
    Tooltip,
    useTheme,
    useMediaQuery,
    Card,
    CardContent,
    Typography,
    Box,
    Stack,
    Avatar,
    Chip,
    alpha
} from '@mui/material';
import { 
    Visibility as ViewIcon, 
    Delete as DeleteIcon,
    Person as PersonIcon,
    AccountBalance as AccountBalanceIcon,
    Business as BusinessIcon,
    People as PeopleIcon
} from '@mui/icons-material';
import { PortfolioAccount } from '../types/portfolio';

interface AccountsTableProps {
    accounts: PortfolioAccount[];
    onAccountClick: (account: PortfolioAccount) => void; // Renamed from onSelect to onAccountClick
    onDeleteAccount?: (account: PortfolioAccount) => void; // New prop for delete functionality
}

export const AccountsTable: React.FC<AccountsTableProps> = ({ accounts, onAccountClick, onDeleteAccount }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const getRelationshipIcon = (relationship: string) => {
        switch (relationship.toLowerCase()) {
            case 'self':
            case 'personal':
                return <PersonIcon />;
            case 'spouse':
            case 'partner':
                return <PeopleIcon />;
            case 'business':
            case 'company':
                return <BusinessIcon />;
            default:
                return <AccountBalanceIcon />;
        }
    };

    const getRelationshipColor = (relationship: string) => {
        switch (relationship.toLowerCase()) {
            case 'self':
            case 'personal':
                return 'primary';
            case 'spouse':
            case 'partner':
                return 'secondary';
            case 'business':
            case 'company':
                return 'info';
            default:
                return 'default';
        }
    };    // Mobile Card View
    if (isMobile) {
        return (
            <Stack spacing={3}>
                {accounts.map((account) => (
                    <Card 
                        key={account.id} 
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
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Avatar
                                        sx={{
                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                            color: theme.palette.primary.main,
                                            width: 56,
                                            height: 56,
                                            border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                            fontSize: '1.5rem',
                                            fontWeight: 700
                                        }}
                                    >
                                        {account.name.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Box>
                                        <Typography 
                                            variant="h6" 
                                            component="div"
                                            sx={{ 
                                                fontWeight: 700,
                                                color: theme.palette.text.primary,
                                                mb: 0.5
                                            }}
                                        >
                                            {account.name}
                                        </Typography>
                                        <Chip
                                            icon={getRelationshipIcon(account.relationship)}
                                            label={account.relationship}
                                            size="small"
                                            color={getRelationshipColor(account.relationship) as any}
                                            variant="outlined"
                                            sx={{
                                                fontWeight: 600,
                                                '& .MuiChip-icon': {
                                                    fontSize: '1rem'
                                                }
                                            }}
                                        />
                                    </Box>
                                </Box>
                                {onDeleteAccount && (
                                    <Tooltip title="Delete Account">
                                        <IconButton
                                            onClick={() => onDeleteAccount(account)}
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
                                )}
                            </Box>
                            
                            <Button
                                startIcon={<ViewIcon />}
                                onClick={() => onAccountClick(account)}
                                variant="contained"
                                color="primary"
                                fullWidth
                                size="large"
                                sx={{
                                    py: 1.5,
                                    borderRadius: 2,
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
                                View Portfolio
                            </Button>
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
                        <TableCell>Account Holder</TableCell>
                        <TableCell>Relationship</TableCell>
                        <TableCell align="center">Portfolio Management</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {accounts.map((account, index) => (
                        <TableRow
                            key={account.id}
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
                            <TableCell>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Avatar
                                        sx={{
                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                            color: theme.palette.primary.main,
                                            width: 48,
                                            height: 48,
                                            border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                            fontSize: '1.25rem',
                                            fontWeight: 700
                                        }}
                                    >
                                        {account.name.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Box>
                                        <Typography 
                                            variant="h6" 
                                            sx={{ 
                                                fontWeight: 600,
                                                color: theme.palette.text.primary,
                                                mb: 0.5
                                            }}
                                        >
                                            {account.name}
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            color="text.secondary"
                                            sx={{ fontWeight: 500 }}
                                        >
                                            Account #{account.id}
                                        </Typography>
                                    </Box>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Chip
                                    icon={getRelationshipIcon(account.relationship)}
                                    label={account.relationship}
                                    color={getRelationshipColor(account.relationship) as any}
                                    variant="filled"
                                    sx={{
                                        fontWeight: 600,
                                        '& .MuiChip-icon': {
                                            fontSize: '1rem'
                                        }
                                    }}
                                />
                            </TableCell>
                            <TableCell align="center">
                                <Box display="flex" gap={1} justifyContent="center" alignItems="center">
                                    <Button
                                        startIcon={<ViewIcon />}
                                        onClick={() => onAccountClick(account)}
                                        variant="contained"
                                        color="primary"
                                        sx={{
                                            borderRadius: 2,
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            px: 3,
                                            py: 1,
                                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                            boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
                                            '&:hover': {
                                                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                                                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
                                                transform: 'translateY(-1px)'
                                            }
                                        }}
                                    >
                                        View Portfolio
                                    </Button>
                                    {onDeleteAccount && (
                                        <Tooltip title="Delete Account">
                                            <IconButton
                                                onClick={() => onDeleteAccount(account)}
                                                size="small"
                                                sx={{
                                                    bgcolor: alpha(theme.palette.error.main, 0.08),
                                                    color: theme.palette.error.main,
                                                    ml: 1,
                                                    '&:hover': {
                                                        bgcolor: alpha(theme.palette.error.main, 0.16),
                                                        transform: 'scale(1.1)'
                                                    }
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
