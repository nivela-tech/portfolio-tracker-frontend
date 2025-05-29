import axios, { AxiosError, AxiosRequestHeaders } from 'axios';
import { PortfolioAccount } from '../types/portfolio';

const API_BASE_URL = 'http://localhost:8080/api/accounts'; // Renamed for clarity

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
    return config;
});

// Axios response interceptor to handle errors
apiClient.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
        if (error.response) {
            const apiError = error.response.data as { message?: string, error?: string, status?: number };
            console.error(
                'API Error:', 
                error.response.status, 
                apiError?.message || apiError?.error || JSON.stringify(error.response.data)
            );
        } else if (error.request) {
            console.error('Network Error - No response received:', error.message);
        } else {
            console.error('Error setting up request:', error.message);
        }
        return Promise.reject(error);
    }
);

export const accountApi = {    createAccount: async (account: Omit<PortfolioAccount, 'id' | 'userId'>): Promise<PortfolioAccount> => {
        try {
            // Fix: remove the trailing slash to prevent double slashes
            const response = await apiClient.post<PortfolioAccount>('', account);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            // Enhanced error logging
            console.error('Account creation failed:', {
                status: axiosError.response?.status,
                statusText: axiosError.response?.statusText,
                data: axiosError.response?.data,
                headers: axiosError.response?.headers
            });
            
            // Format error message
            const errorMessage = typeof axiosError.response?.data === 'string' 
                ? axiosError.response.data 
                : (axiosError.response?.data as any)?.message || 'Failed to create account';
            
            throw new Error(errorMessage);
        }
    },

    getAllAccounts: async (): Promise<PortfolioAccount[]> => {
        try {
            const response = await apiClient.get<PortfolioAccount[]>('/'); // Corrected endpoint to be relative to baseURL
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            throw new Error(axiosError.response?.data as string || 'Failed to fetch accounts');
        }
    },

    getAccountById: async (id: string): Promise<PortfolioAccount> => { // Changed id type to string
        try {
            const response = await apiClient.get<PortfolioAccount>(`/${id}`);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            throw new Error(axiosError.response?.data as string || 'Failed to fetch account');
        }
    },

    updateAccount: async (id: string, account: Partial<PortfolioAccount>): Promise<PortfolioAccount> => { // Changed id type to string
        try {
            const response = await apiClient.put<PortfolioAccount>(`/${id}`, account);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            throw new Error(axiosError.response?.data as string || 'Failed to update account');
        }
    },

    deleteAccount: async (id: string): Promise<void> => { // Changed id type to string
        try {
            await apiClient.delete(`/${id}`);
        } catch (error) {
            const axiosError = error as AxiosError;
            throw new Error(axiosError.response?.data as string || 'Failed to delete account');
        }
    },

    exportAccounts: async (format: 'xlsx' | 'csv'): Promise<Blob> => {
        try {
            const response = await apiClient.get<Blob>(`/accounts/export`, {
                params: { format },
                responseType: 'blob',
            });
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            throw new Error(axiosError.response?.data as string || `Failed to export accounts as ${format}`);
        }
    }
};
