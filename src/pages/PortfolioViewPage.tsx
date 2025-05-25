import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Paper,
    Typography,
    Button,
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
    Divider
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AddIcon from '@mui/icons-material/Add';
import PieChartIcon from '@mui/icons-material/PieChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import { PortfolioEntry, PortfolioAccount } from '../types/portfolio';
import { PortfolioTable } from '../components/PortfolioTable';
import { PortfolioChart } from '../components/PortfolioChart';
import { AddEntryForm } from '../components/AddEntryForm';
import { portfolioApi } from '../services/portfolioApi';
import { accountApi } from '../services/accountApi';
import { NetWorthDisplay } from '../components/NetWorthDisplay';
import { PORTFOLIO_TYPES, CURRENCIES, COUNTRIES } from '../utils/constants';
import { convertCurrency } from '../utils/currencyConverter';
import { NetWorthBox } from '../components/NetWorthBox';
import { AccountList } from '../components/AccountList';
import { ChartControls } from '../components/ChartControls';

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
    // Combined view when no accountId is present in the URL
    const isCombinedView = !accountId;

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            if (isCombinedView) {
                // Get the combined portfolio
                const entriesData = await portfolioApi.getAllEntries(); // Use getAllEntries without accountId to get all entries
                console.log('All entries loaded:', entriesData);
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
    const loadAllAccounts = async () => {
        try {
            // Don't set loading state here to avoid UI flickering
            const accountsData = await accountApi.getAllAccounts();
            setAllAccounts(accountsData);
            
            // Load entries for each account
            const entriesMap = new Map<number, PortfolioEntry[]>();
            
            for (const account of accountsData) {
                try {
                    const accountEntries = await portfolioApi.getAllEntries(account.id);
                    entriesMap.set(account.id, accountEntries);
                } catch (err) {
                    console.error(`Failed to load entries for account ${account.id}:`, err);
                }
            }
            
            setAccountEntries(entriesMap);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load accounts';
            setError(message);
        }
    };
    useEffect(() => {
        loadData();
        if (isCombinedView) {
            loadAllAccounts();
        }
    }, [accountId, isCombinedView]);

    const handleAddEntry = async (entry: PortfolioEntry) => {
        try {
            setError(null);
            const newEntry = await portfolioApi.addEntry({ ...entry, accountId: parseInt(accountId!) });
            setEntries([...entries, newEntry]);
            setIsAddDialogOpen(false);
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
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to delete entry';
            setError(message);
        }
    };    const handleCloseError = () => {
        setError(null);
    };    // Calculate total net worth for all entries in the selected currency
    const calculateTotalNetWorth = () => {
        if (isCombinedView && accountEntries.size > 0) {
            // Sum up all account entries when in combined view
            let total = 0;
            accountEntries.forEach((entries, accountId) => {
                entries.forEach(entry => {
                    total += convertCurrency(entry.amount, entry.currency, selectedCurrency);
                });
            });
            return total;
        } else {
            // Use the entries state for individual account view
            return entries.reduce((total, entry) => {
                return total + convertCurrency(entry.amount, entry.currency, selectedCurrency);
            }, 0);
        }
    };// Calculate net worth for a specific account in the selected currency
    const calculateAccountNetWorth = (accountId: number) => {
        // Get entries for this specific account from our map
        const accountSpecificEntries = accountEntries.get(accountId) || [];
        
        // Calculate net worth by converting all amounts to the selected currency
        return accountSpecificEntries.reduce((total, entry) => {
            return total + convertCurrency(entry.amount, entry.currency, selectedCurrency);
        }, 0);
    };

    // Navigate to account page when clicked
    const handleAccountClick = (accountId: number) => {
        navigate(`/portfolio/${accountId}`);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (!account && !isCombinedView) {
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
        <Container maxWidth="lg">
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 3 }}>
                {/* Left column */}
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

                {/* Right column */}
                <Box sx={{ flex: 1 }}>
                    {/* Chart controls and chart */}
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

                    {/* Portfolio Entries Table */}
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Portfolio Entries
                        </Typography>
                        <PortfolioTable
                            entries={entries}
                            showMemberName={isCombinedView}
                            onEdit={(entry) => {
                                setSelectedEntry(entry);
                                setIsEditDialogOpen(true);
                            }}
                            onDelete={handleDeleteEntry}
                        />
                    </Paper>
                </Box>
            </Box>

            {/* Dialogs */}
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
