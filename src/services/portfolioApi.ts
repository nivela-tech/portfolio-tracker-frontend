import axios, { AxiosError, AxiosRequestHeaders } from 'axios';
import { PortfolioEntry } from '../types/portfolio';

const API_BASE_URL = 'http://localhost:8080/api/portfolio';

// Helper function to get CSRF token from cookies
const getCsrfToken = (): string | null => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'XSRF-TOKEN') {
            return decodeURIComponent(value);
        }
    }
    return null;
};

// Axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Send cookies with requests
});

// Axios request interceptor to add CSRF token
apiClient.interceptors.request.use(config => {
    if (config.method && ['post', 'put', 'delete'].includes(config.method.toLowerCase())) {
        const csrfToken = getCsrfToken();
        if (csrfToken) {
            if (!config.headers) {
                config.headers = {} as AxiosRequestHeaders;
            }
            // Set both formats of CSRF token header to ensure compatibility
            (config.headers as AxiosRequestHeaders)['X-XSRF-TOKEN'] = csrfToken;
            (config.headers as AxiosRequestHeaders)['X-CSRF-TOKEN'] = csrfToken;
        } else {
            console.warn('CSRF token not found in cookies. This might cause 403 Forbidden errors.');
        }
    }
    // Log URL being requested for debugging
    console.log(`Portfolio API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
});

// Axios response interceptor to handle errors (optional, can be shared if defined globally)
apiClient.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
        if (error.response) {
            const apiError = error.response.data as { message?: string, error?: string, status?: number };
            console.error(
                'Portfolio API Error:', 
                error.response.status, 
                apiError?.message || apiError?.error || JSON.stringify(error.response.data)
            );
        } else if (error.request) {
            console.error('Portfolio Network Error - No response received:', error.message);
        } else {
            console.error('Portfolio Error setting up request:', error.message);
        }
        return Promise.reject(error);
    }
);

export const portfolioApi = {
    getAllEntries: async (accountId?: string): Promise<PortfolioEntry[]> => {
        try {
            const params = accountId ? { accountId } : {};
            console.log('Fetching portfolio entries with params:', params);
            const response = await apiClient.get<PortfolioEntry[]>('', { params });
            console.log('Fetched portfolio entries:', response.data);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error fetching portfolio entries:', {
                status: axiosError.response?.status,
                statusText: axiosError.response?.statusText,
                data: axiosError.response?.data,
            });
            throw new Error(axiosError.response?.data as string || 'Failed to fetch portfolio entries');
        }
    },

    getCombinedPortfolioEntries: async (): Promise<PortfolioEntry[]> => {
        try {
            const response = await apiClient.get<PortfolioEntry[]>('/combined');
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            throw new Error(axiosError.response?.data as string || 'Failed to fetch combined portfolio entries');
        }
    },

    addEntry: async (entry: Omit<PortfolioEntry, 'id' | 'userId'>, userEmail: string): Promise<PortfolioEntry> => {
        try {
            const response = await apiClient.post<PortfolioEntry>('/entries', {
                ...entry,
                user: { email: userEmail },
            });
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            throw new Error(axiosError.response?.data as string || 'Failed to add portfolio entry');
        }
    },

    updateEntry: async (entryId: string, entry: PortfolioEntry): Promise<PortfolioEntry> => {
        try {
            const response = await apiClient.put<PortfolioEntry>(`/entries/${entryId}`, entry, {
                headers: { 'Content-Type': 'application/json' },
            });
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            throw new Error(axiosError.response?.data as string || 'Failed to update portfolio entry');
        }
    },

    deleteEntry: async (entryId: string): Promise<void> => {
        try {
            await apiClient.delete(`/entries/${entryId}`, {
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (error) {
            const axiosError = error as AxiosError;
            throw new Error(axiosError.response?.data as string || 'Failed to delete portfolio entry');
        }
    },

    exportEntries: async (format: 'xlsx' | 'csv', accountId?: string): Promise<Blob> => {
        try {
            const params: { format: string; accountId?: string } = { format };
            if (accountId) {
                params.accountId = accountId;
            }
            const response = await apiClient.get<Blob>('/export', {
                params,
                responseType: 'blob',
            });
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            throw new Error(axiosError.response?.data as string || `Failed to export entries as ${format}`);
        }
    },
};
