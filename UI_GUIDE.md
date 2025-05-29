# Portfolio Tracker UI Guide

This document provides visual descriptions and component interactions to help understand how the UI works.

## Main Pages

### 1. Landing Page
- **Description**: Simple welcome page with sign-in button
- **Key Components**: Sign in with Google button
- **Actions**: Redirects to Portfolio view after authentication

### 2. Portfolio View Page
```
┌───────────────────────────────────────────────────────────────┐
│ Portfolio Tracker                             🔄 User Name ⏏️ │
├─────────┬─────────────────────────────────────────────────────┤
│         │                                                     │
│         │  📊 Net Worth: $XXXXX.XX             Currency: [SGD▼]│
│         │                                                     │
│         │  ACCOUNTS (in combined view)                        │
│ 📂      │  ┌─────────────────────────────────────────────────┐│
│ Portfolio │  │ Account A - $XXXX                            >││
│         │  │ Account B - $XXXX                            >││
│ 👛      │  └─────────────────────────────────────────────────┘│
│ Accounts│                                                     │
│         │  Combined Entries          👁️ 📄 📊 🔄               │
│         │  ┌─────────────────────────────────────────────────┐│
│         │  │ Date | Account | Type | Currency | Amount | ... ││
│         │  │ -------------------------------------------- ││
│         │  │ 5/1  | Acc A   | STOCK| USD      | 1000   | ... ││
│         │  │ 5/2  | Acc B   | BOND | EUR      | 2000   | ... ││
│         │  └─────────────────────────────────────────────────┘│
│         │                                                     │
└─────────┴─────────────────────────────────────────────────────┘
```

- **Key Components**:
  - Net Worth Section (top)
  - Account List (middle, only in combined view)
  - Chart Controls (buttons to toggle chart type, grouping)
  - Portfolio Table (bottom)
  
- **Key Actions**:
  - Currency dropdown: Changes display currency
  - Chart toggle: Show/hide chart
  - Export buttons: XLSX/CSV export
  - View Combined Portfolio button: Navigate to combined view
  - Account click: Navigate to individual account view
  - Add/Edit/Delete buttons: Manage entries

### 3. Account Management
```
┌───────────────────────────────────────────────────────────────┐
│ Portfolio Tracker                             🔄 User Name ⏏️ │
├─────────┬─────────────────────────────────────────────────────┤
│         │                                                     │
│         │  Manage Accounts                                    │
│         │                                                     │
│ 📂      │  ┌─────────────────────────────────────────────────┐│
│ Portfolio │  │ Name       | Relationship | Actions           ││
│         │  │ -------------------------------------------- ││
│ 👛      │  │ Account A   | Self         | 👁️ 🗑️              ││
│ Accounts│  │ Account B   | Spouse       | 👁️ 🗑️              ││
│         │  └─────────────────────────────────────────────────┘│
│         │                                                     │
│         │                                                     │
│         │                                              ➕     │
│         │                                                     │
└─────────┴─────────────────────────────────────────────────────┘
```

- **Key Components**:
  - Account Table
  - Add Account button (floating action button)
  
- **Key Actions**:
  - View button: Navigate to account portfolio
  - Delete button: Remove account
  - Add button: Open dialog to create account

## Dialogs

### 1. Add/Edit Entry Dialog
```
┌───────────────────────────────────────┐
│ Add New Entry / Edit Entry            │
├───────────────────────────────────────┤
│                                       │
│ Type:     [STOCK     ▼]  Date: [    ] │
│                                       │
│ Currency: [USD       ▼]  Amount: [  ] │
│                                       │
│ Country:  [Singapore ▼]  Source: [  ] │
│                                       │
│ Notes:                                │
│ [                                   ] │
│ [                                   ] │
│                                       │
├───────────────────────────────────────┤
│                Cancel    Add Entry    │
└───────────────────────────────────────┘
```

- **Fields**: Type, Date, Currency, Amount, Country, Source, Notes
- **Button Text**: "Add Entry" for new entries, "Save Changes" for edits

### 2. Add Account Dialog
```
┌───────────────────────────────────────┐
│ Add Account                           │
├───────────────────────────────────────┤
│                                       │
│ Name:         [                     ] │
│                                       │
│ Relationship: [Self            ▼]     │
│                                       │
├───────────────────────────────────────┤
│                Cancel    Add Account  │
└───────────────────────────────────────┘
```

## Component Interaction Flow

1. **Adding an Entry**:
   - User clicks Add Entry button (in PortfolioViewPage)
   - EntryDialogs component opens Add dialog
   - AddEntryForm handles submission
   - PortfolioViewPage.handleAddEntry sends POST request to `/api/portfolio/entries`
   - On success, data is reloaded with `loadData()` and `loadAllAccountsData()`

2. **Editing an Entry**:
   - User clicks Edit icon in PortfolioTable
   - PortfolioContent.onEdit calls parent's handleEdit function
   - PortfolioViewPage.handleEdit sets selectedEntry and opens edit dialog
   - EntryDialogs shows form with pre-filled data
   - AddEntryForm handles submission via onSubmit
   - PortfolioViewPage.handleEditEntry sends PUT request to `/api/portfolio/entries/{id}`
   - On success, data is reloaded

3. **Exporting Data**:
   - User clicks XLSX/CSV export button
   - PortfolioViewPage.handleExport calls portfolioApi.exportEntries
   - API requests `/api/portfolio/export/xlsx` or `/api/portfolio/export/csv`
   - Received blob is converted to downloadable file

4. **Authentication Flow**:
   - Layout component provides AuthContext
   - useAuth hook in components accesses authentication state
   - Protected routes redirect unauthenticated users
   - API calls include user info for authorization
