import axios from 'axios';
import { PortfolioEntry } from '../types/portfolio';

const API_URL = 'http://localhost:8080/api/portfolio';

export const portfolioApi = {
    addEntry: async (entry: PortfolioEntry): Promise<PortfolioEntry> => {
        const response = await axios.post(API_URL, entry);
        return response.data;
    },

    updateEntry: async (entry: PortfolioEntry): Promise<PortfolioEntry> => {
        const response = await axios.put(`${API_URL}/${entry.id}`, entry);
        return response.data;
    },

    deleteEntry: async (entryId: number): Promise<void> => {
        await axios.delete(`${API_URL}/${entryId}`);
    },

    getAllEntries: async (accountId?: number): Promise<PortfolioEntry[]> => {
        const response = await axios.get(API_URL + (accountId ? `?accountId=${accountId}` : ''));
        return response.data;
    },

    getEntriesByCurrency: async (currency: string, accountId?: number): Promise<PortfolioEntry[]> => {
        const response = await axios.get(`${API_URL}/currency/${currency}` + (accountId ? `?accountId=${accountId}` : ''));
        return response.data;
    },

    getEntriesByCountry: async (country: string, accountId?: number): Promise<PortfolioEntry[]> => {
        const response = await axios.get(`${API_URL}/country/${country}` + (accountId ? `?accountId=${accountId}` : ''));
        return response.data;
    },

    getEntriesBySource: async (source: string, accountId?: number): Promise<PortfolioEntry[]> => {
        const response = await axios.get(`${API_URL}/source/${source}` + (accountId ? `?accountId=${accountId}` : ''));
        return response.data;
    },    getCombinedPortfolio: async (): Promise<PortfolioEntry[]> => {
        const response = await axios.get(`${API_URL}/combined`);
        return response.data;
    }
};
