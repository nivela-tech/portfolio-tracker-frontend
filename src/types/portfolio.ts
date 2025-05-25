import { PortfolioType, Currency, Country } from '../utils/constants';

export interface PortfolioEntry {
    id: number;
    accountId: number;
    dateAdded: string;
    type: PortfolioType;
    currency: Currency;
    amount: number;
    country: Country;
    source: string;
    notes?: string;
    account?: PortfolioAccount;
}

export interface PortfolioAccount {
    id: number;
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
