import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Paper,
    Typography,
    Dialog,
    Box,
    IconButton,
    Collapse,
    Alert,
    Snackbar,
    CircularProgress,
    Container,
    Stack,
    Tooltip,
    Fab,
    Zoom,
    Select,
    MenuItem,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    Divider,
    Button // Ensured Button is imported
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AddIcon from '@mui/icons-material/Add';
import PieChartIcon from '@mui/icons-material/PieChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description'; 
import TableChartIcon from '@mui/icons-material/TableChart';   
import { PortfolioEntry, PortfolioAccount } from '../types/portfolio';
import { PortfolioTable } from '../components/PortfolioTable';
import { PortfolioChart } from '../components/PortfolioChart';
import { AddEntryForm } from '../components/AddEntryForm';
import { portfolioApi } from '../services/portfolioApi';
import { accountApi } from '../services/accountApi';
import { NetWorthBox } from '../components/NetWorthBox';
import { AccountList } from '../components/AccountList';
import { ChartControls } from '../components/ChartControls';
import { convertCurrency } from '../utils/currencyConverter'; // Ensured convertCurrency is imported

export const PortfolioViewPage: React.FC = () => {
    const { accountId } = useParams<{ accountId: string }>();
    const navigate = useNavigate();
    const [account, setAccount] = useState<PortfolioAccount | null>(null);
    const [entries, setEntries] = useState<PortfolioEntry[]>([]);
    const [allAccounts, setAllAccounts] = useState<PortfolioAccount[]>([]);
    const [accountEntries, setAccountEntries] = useState<Map<number, PortfolioEntry[]>>(new Map());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<PortfolioEntry | null>(null);
    const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
    const [groupBy, setGroupBy] = useState<'type' | 'currency' | 'country' | 'source'>('type');
    const [selectedCurrency, setSelectedCurrency] = useState('SGD');
    const [showGraph, setShowGraph] = useState(true);
    const isCombinedView = !accountId;

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            if (isCombinedView) {
                const entriesData = await portfolioApi.getAllEntries();
                setEntries(entriesData);
                setAccount(null);
            } else {
                if (!accountId) throw new Error('Account ID is required');
                const entriesData = await portfolioApi.getAllEntries(parseInt(accountId));
                const accountData = await accountApi.getAccountById(parseInt(accountId));
                setEntries(entriesData);
                setAccount(accountData);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'An unexpected error occurred';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const loadAllAccountsData = async () => { // Renamed to avoid conflict with component name
        try {
            const accountsData = await accountApi.getAllAccounts();
            setAllAccounts(accountsData);
            const currentAccountEntries = new Map<number, PortfolioEntry[]>(); // Use a different name
            for (const acc of accountsData) {
                try {
                    const accEntries = await portfolioApi.getAllEntries(acc.id);
                    currentAccountEntries.set(acc.id, accEntries);
                } catch (err) {
                    console.error(`Failed to load entries for account ${acc.id}:`, err);
                }
            }
            setAccountEntries(currentAccountEntries);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load accounts';
            setError(message);
        }
    };

    useEffect(() => {
        loadData();
        if (isCombinedView) {
            loadAllAccountsData(); // Call renamed function
        }
    }, [accountId, isCombinedView]);

    const handleAddEntry = async (entry: PortfolioEntry) => {
        try {
            setError(null);
            const newEntry = await portfolioApi.addEntry({ ...entry, accountId: parseInt(accountId!) });
            setEntries([...entries, newEntry]);
            setIsAddDialogOpen(false);
            if (isCombinedView) loadAllAccountsData();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to add entry';
            setError(message);
        }
    };

    const handleEditEntry = async (entry: PortfolioEntry) => {
        try {
            setError(null);
            const updatedEntry = await portfolioApi.updateEntry(entry);
            setEntries(entries.map(e => e.id === updatedEntry.id ? updatedEntry : e));
            setIsEditDialogOpen(false);
            setSelectedEntry(null);
            if (isCombinedView) loadAllAccountsData();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to update entry';
            setError(message);
        }
    };

    const handleDeleteEntry = async (entryId: number) => {
        try {
            setError(null);
            await portfolioApi.deleteEntry(entryId);
            setEntries(entries.filter(e => e.id !== entryId));
            if (isCombinedView) loadAllAccountsData();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to delete entry';
            setError(message);
        }
    }; 

    const handleCloseError = () => {
        setError(null);
    };

    const handleExport = async (format: 'xlsx' | 'csv') => {
        try {
            setError(null);
            const blob = await portfolioApi.exportEntries(format, accountId ? parseInt(accountId) : undefined);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `portfolio_entries.${format}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            const message = err instanceof Error ? err.message : `Failed to export as ${format}`;
            setError(message);
        }
    };

    const calculateTotalNetWorth = () => {
        if (isCombinedView && accountEntries.size > 0) {
            let total = 0;
            accountEntries.forEach((accEntries) => {
                accEntries.forEach(entry => {
                    total += convertCurrency(entry.amount, entry.currency, selectedCurrency);
                });
            });
            return total;
        } else {
            return entries.reduce((total, entry) => {
                return total + convertCurrency(entry.amount, entry.currency, selectedCurrency);
            }, 0);
        }
    };
    
    const calculateAccountNetWorth = (id: number) => {
        const accountSpecificEntries = accountEntries.get(id) || [];
        return accountSpecificEntries.reduce((total, entry) => {
            return total + convertCurrency(entry.amount, entry.currency, selectedCurrency);
        }, 0);
    };

    const handleAccountClick = (id: number) => {
        navigate(`/portfolio/${id}`);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (!account && !isCombinedView && !loading) {
        return (
            <Box textAlign="center" p={3}>
                <Typography color="error">Account not found</Typography>
                <Button variant="contained" onClick={() => navigate('/accounts')} sx={{ mt: 2 }}>
                    Back to Accounts
                </Button>
            </Box>
        );
    }

    return (
        <Container maxWidth={false}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
                <Box sx={{ width: '300px', flexShrink: 0, alignSelf: 'start' }}>
                    <NetWorthBox
                        totalNetWorth={calculateTotalNetWorth()}
                        selectedCurrency={selectedCurrency}
                        onCurrencyChange={setSelectedCurrency}
                    />
                    {isCombinedView && (
                        <AccountList
                            accounts={allAccounts}
                            selectedCurrency={selectedCurrency}
                            calculateAccountNetWorth={calculateAccountNetWorth}
                            onAccountClick={handleAccountClick}
                        />
                    )}
                </Box>

                <Box sx={{ flex: 1 }}>
                    <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
                        <ChartControls
                            chartType={chartType}
                            groupBy={groupBy}
                            setChartType={setChartType}
                            setGroupBy={setGroupBy}
                        />
                        <Box>
                            <Tooltip title={showGraph ? "Hide Chart" : "Show Chart"}>
                                <IconButton onClick={() => setShowGraph(!showGraph)}>
                                    {showGraph ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Collapse in={showGraph}>
                            <Box sx={{ mt: 2 }}>
                                <PortfolioChart
                                    entries={entries}
                                    chartType={chartType}
                                    groupBy={groupBy}
                                    selectedCurrency={selectedCurrency}
                                />
                            </Box>
                        </Collapse>
                    </Paper>

                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6" gutterBottom sx={{ mb: 0 }}>
                                {isCombinedView ? 'All Portfolio Entries' : (account ? `${account.name}'s Entries` : 'Portfolio Entries')}
                            </Typography>
                            <Box>
                                <Tooltip title="Export as XLSX">
                                    <IconButton onClick={() => handleExport('xlsx')} sx={{ mr: 0.5 }}>
                                        <TableChartIcon sx={{ color: 'green' }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Export as CSV">
                                    <IconButton onClick={() => handleExport('csv')}>
                                        <DescriptionIcon sx={{ color: 'blue' }} />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                        <PortfolioTable
                            entries={entries}
                            showMemberName={isCombinedView}
                            onEdit={(entry: PortfolioEntry) => {
                                setSelectedEntry(entry);
                                setIsEditDialogOpen(true);
                            }}
                            onDelete={handleDeleteEntry}
                        />
                    </Paper>
                </Box>
            </Box>

            <Dialog
                open={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <AddEntryForm
                    onSubmit={handleAddEntry}
                    onCancel={() => setIsAddDialogOpen(false)}
                    accountId={parseInt(accountId!)}
                />
            </Dialog>

            <Dialog
                open={isEditDialogOpen}
                onClose={() => {
                    setIsEditDialogOpen(false);
                    setSelectedEntry(null);
                }}
                maxWidth="md"
                fullWidth
            >
                {selectedEntry ? (
                    <AddEntryForm
                        onSubmit={handleEditEntry}
                        onCancel={() => {
                            setIsEditDialogOpen(false);
                            setSelectedEntry(null);
                        }}
                        accountId={selectedEntry.accountId}
                        entry={selectedEntry}
                        isEdit
                    />
                ) : null}
            </Dialog>

            <Zoom in={!isCombinedView}> 
                <Fab
                    color="primary"
                    aria-label="add entry"
                    onClick={() => setIsAddDialogOpen(true)}
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                        zIndex: 1000
                    }}
                >
                    <AddIcon />
                </Fab>
            </Zoom>

            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={handleCloseError}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Container>
    );
};
