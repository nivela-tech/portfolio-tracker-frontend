# Flamefolio Quick Reference

## Quick Start

```bash
# Backend
cd portfolio-tracker-backend
./gradlew bootRun

# Frontend
cd portfolio-tracker-frontend
npm install
npm start
```

## Key Files and Their Purpose

### Frontend

1. **src/pages/PortfolioViewPage.tsx**
   - Main portfolio display page
   - Handles add/edit/delete operations
   - Renders both combined and individual account views

2. **src/components/PortfolioTable.tsx**
   - Displays portfolio entries in table format
   - Contains edit/delete action buttons
   - Shows account name column in combined view

3. **src/components/EntryDialogs.tsx**
   - Manages add/edit entry dialog boxes
   - Passes form data to parent components

4. **src/services/portfolioApi.ts**
   - API client functions for portfolio operations
   - Handles adding, updating, deleting entries
   - Exports portfolio data as XLSX/CSV

5. **src/hooks/usePortfolioData.ts**
   - Custom hook for portfolio data fetching
   - Manages entries, accounts, and loading states

### Backend

1. **controller/PortfolioController.java**
   - REST endpoints for portfolio operations
   - Handles CRUD operations for entries
   - Includes export endpoints

2. **service/PortfolioService.java**
   - Business logic for portfolio operations
   - Manages entry creation, updates, deletion
   - Retrieves filtered entry lists

3. **service/ExportService.java**
   - Handles data export functionality
   - Creates XLSX and CSV exports

## Common Tasks

### 1. Adding a New Feature

1. Identify the component that needs modification
2. Check the corresponding API endpoint in portfolioApi.ts
3. Verify backend controller endpoint exists
4. Implement UI changes and wire up to API

### 2. Fixing UI Issues

1. Check component props and rendering conditions
2. Verify state updates after API operations
3. Ensure loadData() and other refresh functions are called

### 3. API Connection Issues

1. Verify endpoint URLs in portfolioApi.ts match backend controller mappings
2. Check CORS configuration in backend
3. Ensure authentication details are included in requests

## API Authentication

All API requests require OAuth2 authentication. Frontend includes authentication tokens automatically. User email is included in request bodies for operations requiring user verification.

## Integration Patterns

1. **State Management**: React hooks (useState, useEffect)
2. **API Communication**: Axios with interceptors
3. **Authentication**: Context API with useAuth hook
4. **Component Composition**: Parent-child prop passing
