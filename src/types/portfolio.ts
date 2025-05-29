import { PortfolioType, Currency, Country } from '../utils/constants';

export interface PortfolioEntry {
    id: string; // Changed from number to string
    accountId: string; // Changed from number to string
    dateAdded: string;
    type: PortfolioType;
    currency: Currency;
    amount: number;
    country: Country;
    source: string;
    notes?: string;
    account?: PortfolioAccount;
    user?: { email: string }; // Added for authentication purposes
}

export interface PortfolioAccount {
    id: string; // Changed from number to string
    name: string;
    relationship: string;
    entries?: PortfolioEntry[];
}

export interface ChartDataset {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
    memberDetails?: Record<string, number>[];
}

export interface ChartData {
    labels: string[];
    datasets: ChartDataset[];
}
