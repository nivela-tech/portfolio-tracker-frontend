import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { Layout, AuthProvider, useAuth } from './components/Layout'; // Import AuthProvider
import { AccountsPage } from './pages/AccountsPage';
import { PortfolioViewPage } from './pages/PortfolioViewPage';
import { AddEntryPage } from './pages/AddEntryPage';
import LandingPage from './pages/LandingPage'; // Import LandingPage
import './App.css';

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

// ProtectedRoute component
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated, authLoading } = useAuth(); // Use renamed properties

  if (authLoading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/portfolio"
              element={
                <ProtectedRoute>
                  <Layout toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
                    <PortfolioViewPage />
                  </Layout>
                </ProtectedRoute>
              }
            />            <Route
              path="/accounts"
              element={
                <ProtectedRoute>
                  <Layout toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
                    <AccountsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/portfolio/:accountId"
              element={
                <ProtectedRoute>
                  <Layout toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
                    <PortfolioViewPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-entry/:accountId"
              element={
                <ProtectedRoute>
                  <Layout toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
                    <AddEntryPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            {/* Add other protected routes similarly */}
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
