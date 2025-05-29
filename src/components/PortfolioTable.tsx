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
    Tooltip
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
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
}) => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>                        <TableCell>Date Added</TableCell>
                        {showMemberName && <TableCell>Account Name</TableCell>}
                        <TableCell>Type</TableCell>
                        <TableCell>Currency</TableCell>                        <TableCell>Amount</TableCell>                        <TableCell>Country</TableCell>
                        <TableCell>Source</TableCell>
                        {showActions && (
                            <TableCell align="center">Actions</TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {entries.map((entry) => (
                        <TableRow key={entry.id}>
                            <TableCell>
                                {new Date(entry.dateAdded).toLocaleDateString()}
                            </TableCell>
                            {showMemberName && (
                                <TableCell>
                                    {entry.account?.name || 'Unknown'}
                                </TableCell>
                            )}
                            <TableCell>{entry.type}</TableCell>
                            <TableCell>{entry.currency}</TableCell>
                            <TableCell>
                                {entry.amount.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </TableCell>                            <TableCell>{entry.country}</TableCell>
                            <TableCell>{entry.source}</TableCell>
                            {showActions && (
                                <TableCell align="center">
                                    <Tooltip title="Edit">
                                        <IconButton 
                                            onClick={() => onEdit(entry)}
                                            size="small"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton 
                                            onClick={() => onDelete(entry.id)}
                                            size="small"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
