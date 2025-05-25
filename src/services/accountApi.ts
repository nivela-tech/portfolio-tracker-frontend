import axios, { AxiosError } from 'axios';
import { PortfolioAccount } from '../types/portfolio';

const API_URL = 'http://localhost:8080/api/accounts';

// Axios response interceptor to handle errors
axios.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
        if (error.response) {
            console.error('API Error:', error.response.status, error.response.data);
        } else if (error.request) {
            console.error('Network Error:', error.message);
        } else {
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export const accountApi = {
    createAccount: async (account: PortfolioAccount): Promise<PortfolioAccount> => {
        try {
            const response = await axios.post(API_URL, account);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            throw new Error(axiosError.response?.data as string || 'Failed to create account');
        }
    },

    getAllAccounts: async (): Promise<PortfolioAccount[]> => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            throw new Error(axiosError.response?.data as string || 'Failed to fetch accounts');
        }
    },

    getAccountById: async (id: number): Promise<PortfolioAccount> => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            throw new Error(axiosError.response?.data as string || `Failed to fetch account ${id}`);
        }
    }
};
