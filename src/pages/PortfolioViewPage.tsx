import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';
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
    Button 
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
import { convertCurrency } from '../utils/currencyConverter';
import { useAuth } from '../components/Layout';

export const PortfolioViewPage: React.FC = () => {
    const { accountId } = useParams<{ accountId: string }>();
    const navigate = useNavigate();
    const { user, isLoading: authLoading, login } = useAuth(); // Corrected to isLoading

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
        if (!user) return; // Don't load if no user
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

    const loadAllAccountsData = async () => {
        if (!user) return; // Don't load if no user
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
        if (user) { // Only load data if user is authenticated
            loadData();
            if (isCombinedView) {
                loadAllAccountsData(); // Call renamed function
            }
        }
    }, [accountId, isCombinedView, user]);

    const handleAddEntry = async (entry: Omit<PortfolioEntry, 'id' | 'accountId' | 'userId'>) => {
        if (!user) return;
        try {
            setError(null);
            // accountId should be part of the entry object if it's for a specific account
            // The backend will associate the userId
            const currentAccountId = accountId ? parseInt(accountId) : undefined;
            if (currentAccountId === undefined && !isCombinedView) {
                setError("Account ID is missing for adding an entry.");
                return;
            }
            const entryData = currentAccountId !== undefined
                ? { ...entry, accountId: currentAccountId }
                : entry; 
            // Ensure type compatibility if accountId might be undefined in entryData
            const newEntry = await portfolioApi.addEntry(entryData as Omit<PortfolioEntry, 'id' | 'userId'>);
            setEntries(prevEntries => [...prevEntries, newEntry]);
            setIsAddDialogOpen(false);
            if (isCombinedView) loadAllAccountsData();
            else loadData(); // Reload data for the current account view
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to add entry';
            setError(message);
        }
    };

    const handleEditEntry = async (entry: PortfolioEntry) => {
        if (!user) return;
        try {
            setError(null);
            const updatedEntry = await portfolioApi.updateEntry(entry);
            setEntries(entries.map(e => e.id === updatedEntry.id ? updatedEntry : e));
            setIsEditDialogOpen(false);
            setSelectedEntry(null);
            if (isCombinedView) loadAllAccountsData();
            else loadData(); // Reload data for the current account view
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to update entry';
            setError(message);
        }
    };

    const handleDeleteEntry = async (entryId: number) => {
        if (!user) return;
        try {
            setError(null);
            await portfolioApi.deleteEntry(entryId);
            setEntries(entries.filter(e => e.id !== entryId));
            if (isCombinedView) loadAllAccountsData();
            else loadData(); // Reload data for the current account view
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to delete entry';
            setError(message);
        }
    }; 

    const handleCloseError = () => {
        setError(null);
    };

    const handleExport = async (format: 'xlsx' | 'csv') => {
        if (!user) return;
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
        if (!user) return 0;
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
        if (!user) return 0;
        const accountSpecificEntries = accountEntries.get(id) || [];
        return accountSpecificEntries.reduce((total, entry) => {
            return total + convertCurrency(entry.amount, entry.currency, selectedCurrency);
        }, 0);
    };

    const handleAccountClick = (id: number) => {
        navigate(`/portfolio/${id}`);
    };

    if (authLoading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (!user) {
        return (
            <Container sx={{ textAlign: 'center', mt: 5 }}>
                <Typography variant="h5" gutterBottom>
                    Welcome to Your Portfolio Tracker
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                    Please sign in to manage and view your portfolios.
                </Typography>
                <Button variant="contained" color="primary" onClick={login}>
                    Sign in with Google
                </Button>
            </Container>
        );
    }

    // Main content rendering starts here
    const currentNetWorth = isCombinedView 
        ? calculateTotalNetWorth() 
        : (accountId ? calculateAccountNetWorth(parseInt(accountId)) : 0); // Ensure accountId is valid before parsing

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            {error && (
                <Snackbar
                    open={!!error}
                    autoHideDuration={6000}
                    onClose={handleCloseError}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
                        {error}
                    </Alert>
                </Snackbar>
            )}

            <Stack direction="row" spacing={2} alignItems="center" mb={2} justifyContent="space-between">
                <Typography variant="h4" component="h1" gutterBottom sx={{ flexGrow: 1 }}>
                    {isCombinedView ? 'Combined Portfolio' : (account ? `${account.name} Overview` : 'Loading Account...')}
                </Typography>
                {!isCombinedView && (
                     <Tooltip title="View Combined Portfolio">
                        <Button variant="outlined" onClick={() => navigate('/portfolio')}>
                            View All Accounts
                        </Button>
                    </Tooltip>
                )}
            </Stack>

            <NetWorthBox 
                totalNetWorth={currentNetWorth} // Corrected prop name
                selectedCurrency={selectedCurrency}
                onCurrencyChange={setSelectedCurrency as (currency: string) => void} // Cast to expected type
            />

            {isCombinedView && (
                <Box sx={{ mb: 3, mt:3 }}>
                    <Typography variant="h5" gutterBottom>All Accounts</Typography>
                    <AccountList 
                        accounts={allAccounts}
                        onAccountClick={handleAccountClick} 
                        selectedCurrency={selectedCurrency}
                        calculateAccountNetWorth={calculateAccountNetWorth}
                    />
                </Box>
            )}

            <Paper sx={{ p: 2, mt: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">
                        {isCombinedView ? 'All Entries' : `Entries for ${account?.name}`}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        <Tooltip title={showGraph ? "Hide Chart" : "Show Chart"}>
                            <IconButton onClick={() => setShowGraph(!showGraph)}>
                                {showGraph ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Export as XLSX">
                            <IconButton onClick={() => handleExport('xlsx')}>
                                <DescriptionIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Export as CSV">
                            <IconButton onClick={() => handleExport('csv')}>
                                <TableChartIcon />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Stack>

                <Collapse in={showGraph}>
                    {entries.length > 0 ? (
                        <>
                            <ChartControls 
                                chartType={chartType} 
                                setChartType={setChartType as (type: 'pie' | 'bar') => void} 
                                groupBy={groupBy} 
                                setGroupBy={setGroupBy as (group: 'type' | 'currency' | 'country' | 'source') => void} 
                            />
                            <PortfolioChart 
                                entries={entries} 
                                chartType={chartType} 
                                groupBy={groupBy} 
                                selectedCurrency={selectedCurrency} 
                            />
                        </>
                    ) : (
                        !loading && <Typography sx={{textAlign: 'center', my: 2}}>No entries to display in chart.</Typography>
                    )}
                </Collapse>

                <PortfolioTable 
                    entries={entries} 
                    onEdit={(entry) => { setSelectedEntry(entry); setIsEditDialogOpen(true); }} 
                    onDelete={handleDeleteEntry} 
                    selectedCurrency={selectedCurrency} // This was the error, prop didn't exist
                    loading={loading} // Added loading prop
                />
            </Paper>

            {user && !isCombinedView && accountId && (
                <Zoom in={true}>
                    <Fab 
                        color="primary" 
                        aria-label="add entry" 
                        sx={{ position: 'fixed', bottom: 16, right: 16 }} 
                        onClick={() => setIsAddDialogOpen(true)}
                    >
                        <AddIcon />
                    </Fab>
                </Zoom>
            )}

            <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} maxWidth="sm" fullWidth>
                <AddEntryForm 
                    onSubmit={handleAddEntry} // Changed from onAddEntry to onSubmit
                    onSuccess={() => setIsAddDialogOpen(false)} // Added onSuccess (previously part of onCancel)
                    onCancel={() => setIsAddDialogOpen(false)} 
                    accountId={accountId ? parseInt(accountId) : undefined} 
                />
            </Dialog>

            <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} maxWidth="sm" fullWidth>
                {selectedEntry && (
                    <AddEntryForm 
                        onSubmit={handleEditEntry} // Changed from onAddEntry to onSubmit
                        onSuccess={() => { setIsEditDialogOpen(false); setSelectedEntry(null); }} // Added onSuccess
                        onCancel={() => { setIsEditDialogOpen(false); setSelectedEntry(null); }} 
                        entry={selectedEntry} // Renamed from existingEntry to entry
                        isEdit={true} // Explicitly set isEdit
                        accountId={selectedEntry.accountId} 
                    />
                )}
            </Dialog>
        </Container>
    );
};
