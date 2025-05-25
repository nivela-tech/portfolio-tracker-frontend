import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, IconButton } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { Layout } from './components/Layout';
import { FamilyAccountsPage } from './pages/FamilyAccountsPage';
import { PortfolioViewPage } from './pages/PortfolioViewPage';
import { AddEntryPage } from './pages/AddEntryPage';
import { AddEntryForm } from './components/AddEntryForm';
import { PortfolioChart } from './components/PortfolioChart';
import { PortfolioTable } from './components/PortfolioTable';
import { AddAccountForm } from './components/AddAccountForm';
import { AccountsTable } from './components/AccountsTable';
import { portfolioApi } from './services/portfolioApi';
import { accountApi } from './services/accountApi';
import { PortfolioEntry, PortfolioAccount } from './types/portfolio';
import './App.css';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
});

export function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout toggleTheme={toggleTheme} isDarkMode={isDarkMode} />}>
            <Route index element={<PortfolioViewPage />} />
            <Route path="accounts" element={<FamilyAccountsPage />} />
            <Route path="portfolio/:accountId" element={<PortfolioViewPage />} />
            <Route path="add-entry/:accountId" element={<AddEntryPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
