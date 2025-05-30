import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Paper,
    Typography,
    Dialog,
    Box,
    IconButton,
    Collapse,
    Container,
    Stack,
    Tooltip,
    Fab,
    Zoom,
    Button,
    useTheme,
    useMediaQuery 
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
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorDisplay } from '../components/ErrorDisplay';
import { portfolioApi } from '../services/portfolioApi';
import { accountApi } from '../services/accountApi';
import { NetWorthBox } from '../components/NetWorthBox';
import { AccountList } from '../components/AccountList';
import { ChartControls } from '../components/ChartControls';
import { convertCurrency } from '../utils/currencyConverter';
import { useAuth } from '../contexts/AuthContext';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { NetWorthSection } from '../components/NetWorthSection';
import { PortfolioContent } from '../components/PortfolioContent';
import { EntryDialogs } from '../components/EntryDialogs';
import { useUserPreferences } from '../contexts/UserPreferencesContext';

export const PortfolioViewPage: React.FC = () => {
    const { accountId: routeAccountId } = useParams<{ accountId: string }>();
    const navigate = useNavigate();
    const { user, authLoading, login } = useAuth();
    const { preferences } = useUserPreferences();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const { account, entries, allAccounts, accountEntries, loading, error: apiError, loadData, loadAllAccountsData } = usePortfolioData(routeAccountId);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<PortfolioEntry | null>(null);
    const [selectedCurrency, setSelectedCurrency] = useState(preferences.defaultCurrency);
    const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
    const [groupBy, setGroupBy] = useState<'type' | 'currency' | 'country' | 'source'>('type');
    const [showGraph, setShowGraph] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const isCombinedView = !routeAccountId;

    const handleApiError = (err: unknown): string => {
        if (err instanceof Error) {
            return err.message;
        }
        if (typeof err === 'object' && err !== null) {
            return JSON.stringify(err);
        }
        return 'An unexpected error occurred';
    };    useEffect(() => {
        // Ensure all accounts data is loaded on component mount
        loadAllAccountsData();
    }, []); // Empty dependency array ensures this runs only once

    useEffect(() => {
        // Load data when the component mounts or when routeAccountId changes
        loadData();
    }, [routeAccountId]);const handleAddEntry = async (entry: Omit<PortfolioEntry, 'id' | 'accountId' | 'userId'>) => {
        try {
            const currentAccountId = routeAccountId;
            if (currentAccountId === undefined && !isCombinedView) {
                throw new Error("Account ID is missing for adding an entry.");
            }
            const entryData = currentAccountId !== undefined
                ? { ...entry, accountId: currentAccountId }
                : entry;
            if (!user) {
                throw new Error('User is not authenticated');
            }
            await portfolioApi.addEntry(entryData as Omit<PortfolioEntry, 'id' | 'userId'>, user.email);
            
            // Update both current view data and all accounts data to ensure net worth is recalculated
            await loadData();
            await loadAllAccountsData();  // Added to update accountEntries for net worth calculation
            
            setIsAddDialogOpen(false);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to add entry';
            console.error(message);
        }
    };    const handleEditEntry = async (entry: PortfolioEntry) => {
        try {            if (!user) {
                throw new Error('User is not authenticated');
            }
              // Add user email to the entry object
            entry.user = { email: user.email };
            
            await portfolioApi.updateEntry(entry.id, entry);
            
            // Update both current view data and all accounts data to ensure net worth is recalculated
            await loadData();
            await loadAllAccountsData();  // Added to update accountEntries for net worth calculation
            
            setIsEditDialogOpen(false);
            setSelectedEntry(null);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to update entry';
            console.error('Error updating entry:', message);
            setError(`Failed to update entry: ${message}`);
        }
    };const handleDeleteEntry = async (entryId: string) => {
        try {            if (!user) {
                throw new Error('User is not authenticated');
            }
            
            await portfolioApi.deleteEntry(entryId, user.email);
            
            // Update both current view data and all accounts data to ensure net worth is recalculated
            await loadData();
            await loadAllAccountsData();  // Added to update accountEntries for net worth calculation
            
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to delete entry';
            console.error('Error deleting entry:', message);
            setError(`Failed to delete entry: ${message}`);
        }
    };

    const handleCloseError = () => {
        setError(null);
    };    const handleExport = async (format: 'xlsx' | 'csv') => {
        if (!user) return;
        try {
            setError(null);
            const blob = await portfolioApi.exportEntries(format, routeAccountId ? routeAccountId : undefined);
            
            if (blob && blob.size > 0) {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `portfolio_entries.${format}`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            } else {
                setError(`No data to export as ${format}`);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : `Failed to export as ${format}`;
            console.error(`Export error (${format}):`, err);
            setError(`Export failed: ${message}`);
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
    };    if (authLoading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <LoadingSpinner variant="component" message="Loading portfolio..." />
            </Container>
        );
    }

    if (!user) {
        return (            <Container sx={{ textAlign: 'center', mt: 5 }}>                <Typography variant="h5" gutterBottom>
                    Welcome to Your Agni Folio
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
        : (routeAccountId ? calculateAccountNetWorth(routeAccountId) : 0);    return (
        <Container maxWidth="xl" sx={{ mt: isMobile ? 2 : 4, mb: isMobile ? 2 : 4, px: isMobile ? 1 : 3 }}>
            <ErrorDisplay
                error={error}
                variant="snackbar"
                severity="error"
                onClose={handleCloseError}
                onRetry={() => loadData()}
            />            <NetWorthSection 
                totalNetWorth={currentNetWorth}
                selectedCurrency={selectedCurrency}
                onCurrencyChange={setSelectedCurrency as (currency: string) => void}
            />

            {/* Restore graph controls and combined view functionality */}
            

            {isCombinedView && (
                <Box sx={{ mb: 3, mt: 3 }}>
                    {allAccounts.length > 0 ? (
                        <AccountList 
                            accounts={allAccounts} 
                            onAccountClick={handleAccountClick} 
                            selectedCurrency={selectedCurrency} 
                            calculateAccountNetWorth={calculateAccountNetWorth} 
                        />
                    ) : (
                        <Box textAlign="center" mt={3}>
                            <Typography variant="h6">No accounts found.</Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                Create one using the button below.
                            </Typography>
                            <Button variant="contained" color="primary" onClick={() => navigate('/accounts')}>
                                Add Account
                            </Button>
                        </Box>
                    )}
                </Box>
            )}            <Stack 
                direction={isMobile ? "column" : "row"} 
                justifyContent="space-between" 
                alignItems={isMobile ? "stretch" : "center"} 
                mb={2}
                mt={3}
                spacing={isMobile ? 1 : 0}
            >
                <Typography variant="h6" sx={{ mb: isMobile ? 1 : 0 }}>
                    {isCombinedView ? 'Combined Entries' : `Entries for ${account?.name}`}
                </Typography>
                <Stack 
                    direction="row" 
                    spacing={isMobile ? 0.5 : 1}
                    flexWrap="wrap"
                    justifyContent={isMobile ? "center" : "flex-end"}
                >
                    <Tooltip title={showGraph ? "Hide Chart" : "Show Chart"}>
                        <IconButton onClick={() => setShowGraph(!showGraph)} size={isMobile ? "small" : "medium"}>
                            {showGraph ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Export as XLSX">
                        <IconButton onClick={() => handleExport('xlsx')} size={isMobile ? "small" : "medium"}>
                            <DescriptionIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Export as CSV">
                        <IconButton onClick={() => handleExport('csv')} size={isMobile ? "small" : "medium"}>
                            <TableChartIcon />
                        </IconButton>
                    </Tooltip>
                    {!isCombinedView && (
                        <Tooltip title="View Combined Portfolio">
                            <Button 
                                variant="outlined" 
                                onClick={() => navigate('/portfolio')}
                                size={isMobile ? "small" : "medium"}
                                sx={{ 
                                    minWidth: isMobile ? 'auto' : undefined,
                                    fontSize: isMobile ? '0.75rem' : undefined
                                }}
                            >
                                {isMobile ? "Combined" : "View Combined Accounts"}
                            </Button>
                        </Tooltip>
                    )}
                </Stack>
            </Stack>

            {showGraph && (
                <ChartControls 
                    chartType={chartType} 
                    setChartType={setChartType} 
                    groupBy={groupBy} 
                    setGroupBy={setGroupBy} 
                />
            )}            <PortfolioContent 
                entries={entries} 
                chartType={chartType} 
                groupBy={groupBy} 
                selectedCurrency={selectedCurrency} 
                loading={loading} 
                showGraph={showGraph} 
                onEdit={isCombinedView ? () => {} : handleEdit} 
                onDelete={isCombinedView ? () => {} : handleDelete} 
                showActions={!isCombinedView}
                showMemberName={isCombinedView} 
            />            {/* Add Entry Button */}
            {!isCombinedView && user && (
                <Zoom in={true}>
                    <Fab 
                        color="primary" 
                        aria-label="add entry" 
                        sx={{ 
                            position: 'fixed', 
                            bottom: isMobile ? 16 : 16, 
                            right: isMobile ? 16 : 16,
                            width: isMobile ? 48 : 56,
                            height: isMobile ? 48 : 56
                        }} 
                        onClick={() => setIsAddDialogOpen(true)}
                        size={isMobile ? "medium" : "large"}
                    >
                        <AddIcon />
                    </Fab>
                </Zoom>
            )}

            {/* Entry Dialogs Component */}            <EntryDialogs 
                user={!!user} 
                isAddDialogOpen={isAddDialogOpen} 
                setIsAddDialogOpen={setIsAddDialogOpen} 
                isEditDialogOpen={isEditDialogOpen} 
                setIsEditDialogOpen={setIsEditDialogOpen} 
                selectedEntry={selectedEntry} 
                loadData={loadData} 
                setSelectedEntry={setSelectedEntry} 
                handleAddEntry={handleAddEntry}
                handleEditEntry={handleEditEntry}
            />
        </Container>
    );
};
