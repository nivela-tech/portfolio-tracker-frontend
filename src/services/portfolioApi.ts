import axios from 'axios';
import { PortfolioEntry } from '../types/portfolio';

const API_URL = 'http://localhost:8080/api/portfolio';

export const portfolioApi = {
    getAllEntries: async (accountId?: number): Promise<PortfolioEntry[]> => {
        const url = accountId ? `${API_URL}?accountId=${accountId}` : `${API_URL}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch portfolio entries');
        }
        return response.json();
    },

    getCombinedPortfolioEntries: async (): Promise<PortfolioEntry[]> => {
        const response = await fetch(`${API_URL}/combined`);
        if (!response.ok) {
            throw new Error('Failed to fetch combined portfolio entries');
        }
        return response.json();
    },

    addEntry: async (entry: Omit<PortfolioEntry, 'id'>): Promise<PortfolioEntry> => {
        const response = await axios.post(API_URL, entry);
        return response.data;
    },

    updateEntry: async (entry: PortfolioEntry): Promise<PortfolioEntry> => {
        const response = await axios.put(`${API_URL}/${entry.id}`, entry);
        return response.data;
    },

    deleteEntry: async (entryId: number): Promise<void> => {
        const response = await fetch(`${API_URL}/${entryId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete portfolio entry');
        }
    },

    exportEntries: async (format: 'xlsx' | 'csv', accountId?: number): Promise<Blob> => {
        const url = accountId 
            ? `${API_URL}/export/${format}?accountId=${accountId}` 
            : `${API_URL}/export/${format}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to export entries as ${format}`);
        }
        return response.blob(); // Correctly return the blob
    }
};
