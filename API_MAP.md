# Flamefolio API Map

## Frontend-to-Backend Integration Map

This document provides a clear mapping between frontend UI actions and their corresponding backend API endpoints. Use this as a quick reference when debugging or implementing features.

## User Actions and API Calls

| UI Action | Component | Frontend Function | API Call | Backend Endpoint |
|-----------|-----------|-------------------|---------|-----------------|
| View Portfolio | PortfolioViewPage | loadData() | portfolioApi.getAllEntries() | GET /api/portfolio?accountId={id} |
| View Combined Portfolio | PortfolioViewPage | loadData() | portfolioApi.getCombinedPortfolioEntries() | GET /api/portfolio/combined |
| Add Entry | EntryDialogs | handleAddEntry() | portfolioApi.addEntry() | POST /api/portfolio/entries |
| Edit Entry | EntryDialogs | handleEditEntry() | portfolioApi.updateEntry() | PUT /api/portfolio/entries/{id} |
| Delete Entry | PortfolioTable | handleDelete() | portfolioApi.deleteEntry() | DELETE /api/portfolio/entries/{id} |
| Export XLSX | PortfolioViewPage | handleExport('xlsx') | portfolioApi.exportEntries() | GET /api/portfolio/export/xlsx |
| Export CSV | PortfolioViewPage | handleExport('csv') | portfolioApi.exportEntries() | GET /api/portfolio/export/csv |
| View Accounts | AccountsPage | loadAccounts() | accountApi.getAllAccounts() | GET /api/accounts |
| Create Account | AddAccountForm | handleAccountAdded() | accountApi.createAccount() | POST /api/accounts |
| Delete Account | AccountsTable | handleDeleteConfirm() | accountApi.deleteAccount() | DELETE /api/accounts/{id} |

## API Object Structure

### Portfolio Entry
```typescript
{
  id: string; // UUID
  accountId: string; // UUID of the account
  dateAdded: string; // ISO date string
  type: string; // STOCK, BOND, etc.
  currency: string; // USD, EUR, etc.
  amount: number; // monetary value
  country: string; // country name
  source: string; // source/broker
  notes?: string; // optional notes
  account?: PortfolioAccount; // account details (for combined view)
  user?: { email: string }; // user info (for authentication)
}
```

### Portfolio Account
```typescript
{
  id: string; // UUID
  name: string; // account name
  relationship: string; // relationship to user
  entries?: PortfolioEntry[]; // optional entries list
}
```

## Common Error Scenarios

| Error | Possible Cause | Solution |
|-------|----------------|----------|
| 404 on export | Wrong endpoint URL | Use `/api/portfolio/export/{format}` (not `/api/portfolio/export?format={format}`) |
| 401/403 on edit/delete | Auth issue | Ensure user email is included in request |
| Net worth not updating | Missing reload | Call both loadData() AND loadAllAccountsData() |
| Actions not showing in combined view | UI configuration | Check showActions prop (should be false for combined view) |

## Authentication Flow

1. **Login**: 
   - UI: Login button in LandingPage/Layout
   - Backend: OAuth2 Google authentication
   
2. **Session Management**:
   - UI: AuthContext in Layout.tsx
   - Backend: OAuth2User principal in controllers

3. **Request Authentication**:
   - UI: Automatic token inclusion via cookies
   - Backend: @AuthenticationPrincipal annotation

## Important State Variables

| Component | State Variable | Purpose | Related Props |
|-----------|----------------|---------|--------------|
| PortfolioViewPage | entries | Portfolio entries | Passed to PortfolioContent |
| PortfolioViewPage | selectedEntry | Entry being edited | Passed to EntryDialogs |
| PortfolioViewPage | isCombinedView | View mode flag | Controls UI rendering |
| PortfolioContent | showActions | Show action buttons | Controls edit/delete buttons |
| PortfolioContent | showMemberName | Show account names | Controls account column |
| EntryDialogs | isEdit | Edit mode flag | Controls form button text |
