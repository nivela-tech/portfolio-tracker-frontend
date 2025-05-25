import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button
} from '@mui/material';
import { Visibility as ViewIcon } from '@mui/icons-material';
import { PortfolioAccount } from '../types/portfolio';

interface AccountsTableProps {
    accounts: PortfolioAccount[];
    onSelect: (account: PortfolioAccount) => void;
}

export const AccountsTable: React.FC<AccountsTableProps> = ({ accounts, onSelect }) => {
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
                                    onClick={() => onSelect(account)}
                                    variant="contained"
                                    color="primary"
                                >
                                    View Portfolio
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
