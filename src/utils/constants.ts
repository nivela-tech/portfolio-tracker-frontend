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

export const COUNTRIES = [
    'Argentina',
    'Australia',
    'Austria',
    'Bangladesh',
    'Belgium',
    'Brazil',
    'Canada',
    'Chile',
    'China',
    'Colombia',
    'Denmark',
    'Egypt',
    'Finland',
    'France',
    'Germany',
    'Greece',
    'India',
    'Indonesia',
    'Iran',
    'Ireland',
    'Israel',
    'Italy',
    'Japan',
    'Malaysia',
    'Mexico',
    'Netherlands',
    'New Zealand',
    'Nigeria',
    'Norway',
    'Pakistan',
    'Peru',
    'Philippines',
    'Poland',
    'Portugal',
    'Russia',
    'Saudi Arabia',
    'Singapore',
    'South Africa',
    'South Korea',
    'Spain',
    'Sweden',
    'Switzerland',
    'Taiwan',
    'Thailand',
    'Turkey',
    'United Arab Emirates',
    'United Kingdom',
    'United States',
    'Vietnam'
] as const;
export type Country = typeof COUNTRIES[number];

export const RELATIONSHIP_TYPES = [
    'Self',
    'Spouse',
    'Child',
    'Parent',
    'Sibling',
    'Grandparent',
    'Grandchild',
    'Friend',
    'Other'
] as const;

export type RelationshipType = typeof RELATIONSHIP_TYPES[number];
