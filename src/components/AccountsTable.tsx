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
    Stack
} from '@mui/material';
import { Visibility as ViewIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { PortfolioAccount } from '../types/portfolio';

interface AccountsTableProps {
    accounts: PortfolioAccount[];
    onAccountClick: (account: PortfolioAccount) => void; // Renamed from onSelect to onAccountClick
    onDeleteAccount?: (account: PortfolioAccount) => void; // New prop for delete functionality
}

export const AccountsTable: React.FC<AccountsTableProps> = ({ accounts, onAccountClick, onDeleteAccount }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Mobile Card View
    if (isMobile) {
        return (
            <Stack spacing={2}>
                {accounts.map((account) => (
                    <Card key={account.id} variant="outlined">
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                <Box>
                                    <Typography variant="h6" component="div">
                                        {account.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {account.relationship}
                                    </Typography>
                                </Box>
                                {onDeleteAccount && (
                                    <Tooltip title="Delete Account">
                                        <IconButton
                                            color="error"
                                            onClick={() => onDeleteAccount(account)}
                                            size="small"
                                        >
                                            <DeleteIcon />
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
                            >
                                View Portfolio
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </Stack>
        );
    }

    // Desktop Table View
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Relationship</TableCell>
                        <TableCell align="center">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {accounts.map((account) => (
                        <TableRow
                            key={account.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell>{account.name}</TableCell>
                            <TableCell>{account.relationship}</TableCell>
                            <TableCell align="center">
                                <Button
                                    startIcon={<ViewIcon />}
                                    onClick={() => onAccountClick(account)}
                                    variant="contained"
                                    color="primary"
                                    sx={{ mr: 1 }}
                                >
                                    View Portfolio
                                </Button>
                                {onDeleteAccount && (
                                    <Tooltip title="Delete Account">
                                        <IconButton
                                            color="error"
                                            onClick={() => onDeleteAccount(account)}
                                            size="small"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
