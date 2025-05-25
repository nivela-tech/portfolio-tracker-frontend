// Exchange rates as of May 2025 (hardcoded for demonstration)
const EXCHANGE_RATES: { [key: string]: { [key: string]: number } } = {
    'SGD': {
        'USD': 0.74,
        'EUR': 0.69,
        'GBP': 0.59,
        'JPY': 110.25,
        'CNY': 5.28,
        'INR': 61.50,
        'SGD': 1
    },
    'USD': {
        'SGD': 1.35,
        'EUR': 0.93,
        'GBP': 0.80,
        'JPY': 149.00,
        'CNY': 7.14,
        'INR': 83.11,
        'USD': 1
    },
    'EUR': {
        'SGD': 1.45,
        'USD': 1.07,
        'GBP': 0.86,
        'JPY': 160.22,
        'CNY': 7.68,
        'INR': 89.37,
        'EUR': 1
    },
    'GBP': {
        'SGD': 1.69,
        'USD': 1.25,
        'EUR': 1.16,
        'JPY': 186.30,
        'CNY': 8.93,
        'INR': 103.92,
        'GBP': 1
    },
    'JPY': {
        'SGD': 0.0091,
        'USD': 0.0067,
        'EUR': 0.0062,
        'GBP': 0.0054,
        'CNY': 0.048,
        'INR': 0.56,
        'JPY': 1
    },
    'CNY': {
        'SGD': 0.19,
        'USD': 0.14,
        'EUR': 0.13,
        'GBP': 0.11,
        'JPY': 20.87,
        'INR': 11.64,
        'CNY': 1
    },
    'INR': {
        'SGD': 0.016,
        'USD': 0.012,
        'EUR': 0.011,
        'GBP': 0.0096,
        'JPY': 1.79,
        'CNY': 0.086,
        'INR': 1
    }
};

export const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === toCurrency) return amount;
    const rate = EXCHANGE_RATES[fromCurrency][toCurrency];
    return amount * rate;
};

export const AVAILABLE_CURRENCIES = ['SGD', 'USD', 'EUR', 'GBP', 'JPY', 'CNY', 'INR'] as const;
