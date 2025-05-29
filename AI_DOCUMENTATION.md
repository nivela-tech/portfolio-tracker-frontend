# Flamefolio Frontend Documentation

This document provides a high-level overview of the Flamefolio frontend application to help AI agents work with the codebase more effectively.

## Application Structure

- **pages/**: Contains the main page components
- **components/**: Reusable UI components
- **services/**: API client functions
- **hooks/**: Custom React hooks
- **types/**: TypeScript type definitions
- **utils/**: Helper functions and constants

## Main Pages and Routes

- `/` - LandingPage - Entry point for unauthenticated users
- `/portfolio` - PortfolioViewPage (combined view) - Shows portfolios across all accounts
- `/portfolio/:accountId` - PortfolioViewPage (single account) - Shows portfolio for a specific account
- `/accounts` - AccountsPage - Manages personal accounts
- `/add-entry/:accountId` - AddEntryPage - Form to add a new entry to a specific account

## Authentication

Authentication is handled via Google OAuth. The `useAuth` hook in Layout.tsx manages authentication state and provides:

- `user` - Current user object
- `authLoading` - Loading state
- `login()` - Login function
- `logout()` - Logout function
- `isAuthenticated` - Authentication status

## UI Components and Key Features

### PortfolioViewPage

- **Net Worth Section**: Displays total net worth with currency conversion
- **Account List**: In combined view, shows all accounts with their balances
- **Chart Controls**: Toggle between pie/bar charts and different grouping options
- **Portfolio Content**: Displays portfolio data in chart and table views
- **Actions**:
  - Export as XLSX/CSV: Calls `/api/portfolio/export/xlsx` or `/api/portfolio/export/csv`
  - Add Entry: Opens dialog to add new portfolio entry
  - Edit Entry: Opens dialog to edit existing entry
  - Delete Entry: Removes an entry from the portfolio

### AccountsPage

- Account management (add/view/delete accounts)
- Navigation to individual account portfolios

## API Services

### portfolioApi.ts

Key functions:
- `getAllEntries(accountId?)` - GET `/api/portfolio` - Fetches all entries, optionally filtered by account
- `getCombinedPortfolioEntries()` - GET `/api/portfolio/combined` - Fetches combined entries across accounts
- `addEntry(entry, userEmail)` - POST `/api/portfolio/entries` - Creates new entry
- `updateEntry(entryId, entry)` - PUT `/api/portfolio/entries/{id}` - Updates existing entry
- `deleteEntry(entryId, userEmail)` - DELETE `/api/portfolio/entries/{id}` - Deletes an entry
- `exportEntries(format, accountId?)` - GET `/api/portfolio/export/{format}` - Exports entries as xlsx or csv

### accountApi.ts

Key functions:
- `getAllAccounts()` - GET `/api/accounts` - Fetches all user accounts
- `createAccount(account)` - POST `/api/accounts` - Creates a new account
- `getAccount(id)` - GET `/api/accounts/{id}` - Fetches specific account
- `updateAccount(id, account)` - PUT `/api/accounts/{id}` - Updates an account
- `deleteAccount(id)` - DELETE `/api/accounts/{id}` - Deletes an account

## Special Features

1. **Currency Conversion**: All monetary values can be converted between different currencies
2. **Data Visualization**: Pie and bar charts for portfolio breakdowns (by type/currency/country/source)
3. **Combined View**: Aggregates portfolio data across all accounts
4. **Net Worth Tracking**: Calculates and displays total net worth across portfolios

## Common Issues and Solutions

1. **Net Worth Not Updating**: After adding/editing/deleting entries, make sure to call both `loadData()` and `loadAllAccountsData()` to ensure the net worth calculations are updated correctly.
2. **Authentication Issues**: When making API calls that modify data, ensure user information is included.
3. **Export Functionality**: The export endpoints are `/api/portfolio/export/xlsx` and `/api/portfolio/export/csv`, not `/api/portfolio/export?format=...`
