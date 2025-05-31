import { useState, useEffect } from 'react';
import { portfolioApi } from '../services/portfolioApi';
import { accountApi } from '../services/accountApi';
import { PortfolioEntry, PortfolioAccount } from '../types/portfolio';
import { useAuth } from '../contexts/AuthContext';

export const usePortfolioData = (routeAccountId?: string) => {
    const { user } = useAuth();
    const [account, setAccount] = useState<PortfolioAccount | null>(null);
    const [entries, setEntries] = useState<PortfolioEntry[]>([]);
    const [allAccounts, setAllAccounts] = useState<PortfolioAccount[]>([]);
    const [accountEntries, setAccountEntries] = useState<Map<string, PortfolioEntry[]>>(new Map());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        if (!user) {
            console.warn('User is not authenticated. Skipping data load.');
            return;
        }
        try {
            setLoading(true);
            setError(null);

            if (!routeAccountId) {
                const entriesData = await portfolioApi.getAllEntries();
                setEntries(entriesData);
                setAccount(null);
            } else {
                const [entriesData, accountData] = await Promise.all([
                    portfolioApi.getAllEntries(routeAccountId),
                    accountApi.getAccountById(routeAccountId)
                ]);
                setEntries(entriesData);
                setAccount(accountData);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load data');
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
            const accountsData = await accountApi.getAllAccounts();
            setAllAccounts(accountsData);

            const currentAccountEntries = new Map<string, PortfolioEntry[]>();
            for (const acc of accountsData) {
                try {
                    const accEntries = await portfolioApi.getAllEntries(acc.id);
                    currentAccountEntries.set(acc.id, accEntries);
                } catch (err) {
                    console.error(`Error fetching entries for account ID: ${acc.id}`, err);
                }
            }
            setAccountEntries(currentAccountEntries);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load accounts data');
        }
    };

    useEffect(() => {
        loadData();
    }, [routeAccountId]);

    useEffect(() => {
        loadAllAccountsData();
    }, []);

    return { account, entries, allAccounts, accountEntries, loading, error, loadData, loadAllAccountsData };
};
