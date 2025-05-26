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
    Tooltip
} from '@mui/material';
import { Visibility as ViewIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { PortfolioAccount } from '../types/portfolio';

interface AccountsTableProps {
    accounts: PortfolioAccount[];
    onAccountClick: (account: PortfolioAccount) => void; // Renamed from onSelect to onAccountClick
    onDeleteAccount?: (account: PortfolioAccount) => void; // New prop for delete functionality
}

export const AccountsTable: React.FC<AccountsTableProps> = ({ accounts, onAccountClick, onDeleteAccount }) => {
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
