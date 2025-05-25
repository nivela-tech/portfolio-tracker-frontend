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
            (config.headers as AxiosRequestHeaders)['X-XSRF-TOKEN'] = csrfToken;
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

export const accountApi = {
    createAccount: async (account: Omit<PortfolioAccount, 'id' | 'userId'>): Promise<PortfolioAccount> => {
        try {
            const response = await apiClient.post<PortfolioAccount>('/', account);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            throw new Error(axiosError.response?.data as string || 'Failed to create account');
        }
    },

    getAllAccounts: async (): Promise<PortfolioAccount[]> => {
        try {
            const response = await apiClient.get<PortfolioAccount[]>('/');
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            throw new Error(axiosError.response?.data as string || 'Failed to fetch accounts');
        }
    },

    getAccountById: async (id: number): Promise<PortfolioAccount> => {
        try {
            const response = await apiClient.get<PortfolioAccount>(`/${id}`);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            throw new Error(axiosError.response?.data as string || `Failed to fetch account ${id}`);
        }
    },

    updateAccount: async (id: number, account: Partial<Omit<PortfolioAccount, 'id' | 'userId'>>): Promise<PortfolioAccount> => {
        try {
            const response = await apiClient.put<PortfolioAccount>(`/${id}`, account);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            throw new Error(axiosError.response?.data as string || `Failed to update account ${id}`);
        }
    },

    deleteAccount: async (id: number): Promise<void> => {
        try {
            await apiClient.delete(`/${id}`);
        } catch (error) {
            const axiosError = error as AxiosError;
            throw new Error(axiosError.response?.data as string || `Failed to delete account ${id}`);
        }
    }
};
