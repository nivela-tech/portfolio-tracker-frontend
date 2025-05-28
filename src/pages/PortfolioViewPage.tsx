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
    const { accountId: routeAccountId } = useParams<{ accountId: string }>();
    const navigate = useNavigate();
    const { user, authLoading, login } = useAuth();

    const [account, setAccount] = useState<PortfolioAccount | null>(null);
    const [entries, setEntries] = useState<PortfolioEntry[]>([]);
    const [allAccounts, setAllAccounts] = useState<PortfolioAccount[]>([]);
    const [accountEntries, setAccountEntries] = useState<Map<string, PortfolioEntry[]>>(new Map());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<PortfolioEntry | null>(null);
    const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
    const [groupBy, setGroupBy] = useState<'type' | 'currency' | 'country' | 'source'>('type');
    const [selectedCurrency, setSelectedCurrency] = useState('SGD');
    const [showGraph, setShowGraph] = useState(true);
    const isCombinedView = !routeAccountId;

    const handleApiError = (err: unknown): string => {
        if (err instanceof Error) {
            return err.message;
        }
        if (typeof err === 'object' && err !== null) {
            return JSON.stringify(err);
        }
        return 'An unexpected error occurred';
    };

    const loadData = async () => {
        if (!user) {
            console.warn('User is not authenticated. Skipping data load.');
            return;
        }
        try {
            setLoading(true);
            setError(null);

            if (isCombinedView) {
                console.log('Fetching all entries for combined view.');
                const entriesData = await portfolioApi.getAllEntries();
                setEntries(entriesData);
                setAccount(null);
            } else {
                if (!routeAccountId) {
                    throw new Error('Account ID is required but not provided.');
                }
                console.log(`Fetching entries and account details for account ID: ${routeAccountId}`);
                const [entriesData, accountData] = await Promise.all([
                    portfolioApi.getAllEntries(routeAccountId),
                    accountApi.getAccountById(routeAccountId)
                ]);
                setEntries(entriesData);
                setAccount(accountData);
            }
        } catch (err) {
            console.error('Error loading data:', err);
            setError(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    const loadAllAccountsData = async () => {
        if (!user) {
            console.warn('User is not authenticated. Skipping accounts data load.');
            return;
        }
        try {
            console.log('Fetching all accounts data.');
            const accountsData = await accountApi.getAllAccounts();
            console.log('Fetched accounts data:', accountsData);
            setAllAccounts(accountsData);

            const currentAccountEntries = new Map<string, PortfolioEntry[]>();
            for (const acc of accountsData) {
                try {
                    console.log(`Fetching entries for account ID: ${acc.id}`);
                    const accEntries = await portfolioApi.getAllEntries(acc.id);
                    currentAccountEntries.set(acc.id, accEntries);
                } catch (err) {
                    console.error(`Error fetching entries for account ID: ${acc.id}`, err);
                }
            }
            setAccountEntries(currentAccountEntries);
        } catch (err) {
            console.error('Error loading all accounts data:', err);
            setError(handleApiError(err));
        }
    };

    useEffect(() => {
        // Ensure all accounts data is loaded on component mount
        console.log('Loading all accounts data on mount.');
        loadAllAccountsData();
    }, []); // Empty dependency array ensures this runs only once

    useEffect(() => {
        // Log the routeAccountId and isCombinedView for debugging
        console.log('Route Account ID:', routeAccountId);
        console.log('Is Combined View:', isCombinedView);

        // Load data when the component mounts or when routeAccountId changes
        loadData();
    }, [routeAccountId]);

    const handleAddEntry = async (entry: Omit<PortfolioEntry, 'id' | 'accountId' | 'userId'>) => {
        if (!user) return;
        try {
            setError(null);
            const currentAccountId = routeAccountId;
            if (currentAccountId === undefined && !isCombinedView) {
                setError("Account ID is missing for adding an entry.");
                return;
            }
            const entryData = currentAccountId !== undefined
                ? { ...entry, accountId: currentAccountId }
                : entry;
            const newEntry = await portfolioApi.addEntry(entryData as Omit<PortfolioEntry, 'id' | 'userId'>);
            setEntries(prevEntries => [...prevEntries, newEntry]);
            setIsAddDialogOpen(false);
            if (isCombinedView) loadAllAccountsData();
            else loadData();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to add entry';
            setError(message);
        }
    };

    const handleEditEntry = async (entry: PortfolioEntry) => {
        if (!user) return;
        try {
            setError(null);
            const updatedEntry = await portfolioApi.updateEntry(entry.id, entry);
            setEntries(entries.map(e => e.id === updatedEntry.id ? updatedEntry : e));
            setIsEditDialogOpen(false);
            setSelectedEntry(null);
            if (isCombinedView) loadAllAccountsData();
            else loadData();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to update entry';
            setError(message);
        }
    };

    const handleDeleteEntry = async (entryId: string) => {
        if (!user) return;
        try {
            setError(null);
            await portfolioApi.deleteEntry(entryId);
            setEntries(entries.filter(e => e.id !== entryId));
            if (isCombinedView) loadAllAccountsData();
            else loadData();
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
            const blob = await portfolioApi.exportEntries(format, routeAccountId ? routeAccountId : undefined);
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
    
    const calculateAccountNetWorth = (id: string) => {
        if (!user) return 0;
        const accountSpecificEntries = accountEntries.get(id) || [];
        return accountSpecificEntries.reduce((total, entry) => {
            return total + convertCurrency(entry.amount, entry.currency, selectedCurrency);
        }, 0);
    };

    const handleAccountClick = (id: string) => {
        navigate(`/portfolio/${id}`);
    };

    const handleEdit = (entry: PortfolioEntry) => {
        setSelectedEntry(entry);
        setIsEditDialogOpen(true);
    };

    const handleDelete = (entryId: string) => {
        handleDeleteEntry(entryId);
    };

    const renderContent = () => {
        if (loading) {
            return <CircularProgress />;
        }

        if (error) {
            return <Alert severity="error">{error}</Alert>;
        }        if (entries.length === 0) {
            return (
                <Box textAlign="center" mt={3}>
                    <Typography variant="h6">No portfolio entries available.</Typography>
                    {!isCombinedView && (
                        <>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                Add your first entry using the button below.
                            </Typography>
                            <Button variant="contained" color="primary" onClick={() => setIsAddDialogOpen(true)}>
                                Add Entry
                            </Button>
                        </>
                    )}
                </Box>
            );
        }

        return (
            <>
                <PortfolioTable 
                    entries={entries} 
                    onEdit={handleEdit} 
                    onDelete={handleDelete} 
                    selectedCurrency={selectedCurrency} 
                />
                {showGraph && <PortfolioChart entries={entries} chartType={chartType} groupBy={groupBy} selectedCurrency={selectedCurrency} />}
            </>
        );
    };

    const renderAccounts = () => {
        if (loading) {
            return <CircularProgress />;
        }

        if (allAccounts.length === 0) {            return (
                <Box textAlign="center" mt={3}>
                    <Typography variant="h6">No accounts found.</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        You need to create an account first.
                    </Typography>
                    <Button variant="contained" color="primary" onClick={() => navigate('/accounts')}>
                        Go to Accounts Page
                    </Button>
                </Box>
            );
        }

        return (
            <AccountList 
                accounts={allAccounts} 
                onAccountClick={handleAccountClick} 
                selectedCurrency={selectedCurrency} 
                calculateAccountNetWorth={calculateAccountNetWorth}
            />
        );
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
        : (routeAccountId ? calculateAccountNetWorth(routeAccountId) : 0);

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
                    {isCombinedView ? 'Portfolio Overview' : (account ? `${account.name} Overview` : 'Loading Account...')}
                </Typography>
                {!isCombinedView && routeAccountId && (
                     <Tooltip title="View Combined Portfolio">
                        <Button variant="outlined" onClick={() => navigate('/portfolio')}>
                            View All Accounts
                        </Button>
                    </Tooltip>
                )}
            </Stack>

            <NetWorthBox 
                totalNetWorth={currentNetWorth}
                selectedCurrency={selectedCurrency}
                onCurrencyChange={setSelectedCurrency as (currency: string) => void}
            />

            {isCombinedView && (
                <Box sx={{ mb: 3, mt:3 }}>
                    <Typography variant="h5" gutterBottom>All Accounts</Typography>
                    {renderAccounts()}
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
                </Stack>                <Collapse in={showGraph}>
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
                        !loading && 
                        <Box textAlign="center" my={2}>
                            <Typography variant="body1" mb={1}>No entries to display in chart.</Typography>
                            {!isCombinedView && (
                                <Button 
                                    variant="outlined" 
                                    color="primary" 
                                    size="small"
                                    onClick={() => setIsAddDialogOpen(true)}
                                >
                                    Add First Entry
                                </Button>
                            )}
                        </Box>
                    )}
                </Collapse>

                <PortfolioTable 
                    entries={entries} 
                    onEdit={handleEdit} 
                    onDelete={handleDelete} 
                    selectedCurrency={selectedCurrency}
                    loading={loading}
                />
            </Paper>

            {user && !isCombinedView && routeAccountId && (
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
                    onSubmit={handleAddEntry}
                    onSuccess={() => setIsAddDialogOpen(false)}
                    onCancel={() => setIsAddDialogOpen(false)} 
                    accountId={routeAccountId}
                />
            </Dialog>

            <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} maxWidth="sm" fullWidth>
                {selectedEntry && (
                    <AddEntryForm 
                        onSubmit={handleEditEntry}
                        onSuccess={() => { setIsEditDialogOpen(false); setSelectedEntry(null); }} 
                        onCancel={() => { setIsEditDialogOpen(false); setSelectedEntry(null); }} 
                        entry={selectedEntry}
                        isEdit={true} 
                        accountId={selectedEntry.accountId} // This should be string | undefined
                    />
                )}
            </Dialog>
        </Container>
    );
};
