export const PORTFOLIO_TYPES = [
    'STOCK',
    'BOND',
    'CASH',
    'CRYPTO',
    'MUTUAL_FUND',
    'REAL_ESTATE',
    'FIXED_DEPOSIT',
    'OTHER'
] as const;

export type PortfolioType = typeof PORTFOLIO_TYPES[number];

export const CURRENCIES = ['SGD', 'USD', 'EUR', 'GBP', 'JPY', 'CNY', 'INR'] as const;
export type Currency = typeof CURRENCIES[number];

export const COUNTRIES = ['Singapore', 'India'] as const;
export type Country = typeof COUNTRIES[number];
