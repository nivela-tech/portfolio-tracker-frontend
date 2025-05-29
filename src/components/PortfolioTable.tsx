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
    Divider
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
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Mobile Card View
    if (isMobile) {
        return (
            <Stack spacing={2}>
                {entries.map((entry) => (
                    <Card key={entry.id} variant="outlined">
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                <Typography variant="h6" component="div">
                                    {entry.type}
                                </Typography>
                                {showActions && (
                                    <Box>
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
                                                color="error"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                )}
                            </Box>
                            
                            <Stack spacing={1}>
                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">
                                        Amount:
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {entry.currency} {entry.amount.toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </Typography>
                                </Box>
                                
                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">
                                        Date:
                                    </Typography>
                                    <Typography variant="body2">
                                        {new Date(entry.dateAdded).toLocaleDateString()}
                                    </Typography>
                                </Box>

                                {showMemberName && (
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="body2" color="text.secondary">
                                            Account:
                                        </Typography>
                                        <Typography variant="body2">
                                            {entry.account?.name || 'Unknown'}
                                        </Typography>
                                    </Box>
                                )}
                                
                                <Divider />
                                
                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                    <Chip label={entry.country} size="small" variant="outlined" />
                                    <Chip label={entry.source} size="small" variant="outlined" />
                                    <Chip label={entry.currency} size="small" color="primary" variant="outlined" />
                                </Stack>
                            </Stack>
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
                        <TableCell>Date Added</TableCell>
                        {showMemberName && <TableCell>Account Name</TableCell>}
                        <TableCell>Type</TableCell>
                        <TableCell>Currency</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Country</TableCell>
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
                            </TableCell>
                            <TableCell>{entry.country}</TableCell>
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
