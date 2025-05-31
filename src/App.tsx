import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { Layout, AuthProvider } from './components/Layout'; // Import AuthProvider
import { useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute'; // Import enhanced ProtectedRoute
import { UserPreferencesProvider, useUserPreferences } from './contexts/UserPreferencesContext';
import { AccountsPage } from './pages/AccountsPage';
import { PortfolioViewPage } from './pages/PortfolioViewPage';
import { PerformancePage } from './pages/PerformancePage';
import { SettingsPage } from './pages/SettingsPage';
import { AddEntryPage } from './pages/AddEntryPage';
import LandingPage from './pages/LandingPage'; // Import LandingPage
import './App.css';

// Professional Bank-style Theme Configuration
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1565C0', // Professional blue
      dark: '#0D47A1',
      light: '#42A5F5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2E7D32', // Professional green for financial success
      dark: '#1B5E20',
      light: '#66BB6A',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc', // Light professional background
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#666666',
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
    },
    warning: {
      main: '#f57c00',
      light: '#ff9800',
      dark: '#e65100',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      letterSpacing: '0.01em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      letterSpacing: '0.01em',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
    caption: {
      fontSize: '0.75rem',
      letterSpacing: '0.03em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 1px 3px rgba(0, 0, 0, 0.04), 0px 1px 2px rgba(0, 0, 0, 0.06)',
    '0px 4px 6px rgba(0, 0, 0, 0.04), 0px 2px 4px rgba(0, 0, 0, 0.06)',
    '0px 10px 15px rgba(0, 0, 0, 0.04), 0px 4px 6px rgba(0, 0, 0, 0.07)',
    '0px 20px 25px rgba(0, 0, 0, 0.04), 0px 8px 10px rgba(0, 0, 0, 0.08)',
    '0px 25px 50px rgba(0, 0, 0, 0.06), 0px 12px 20px rgba(0, 0, 0, 0.08)',
    '0px 25px 50px rgba(0, 0, 0, 0.06), 0px 12px 20px rgba(0, 0, 0, 0.08)',
    '0px 25px 50px rgba(0, 0, 0, 0.06), 0px 12px 20px rgba(0, 0, 0, 0.08)',
    '0px 25px 50px rgba(0, 0, 0, 0.06), 0px 12px 20px rgba(0, 0, 0, 0.08)',
    '0px 25px 50px rgba(0, 0, 0, 0.06), 0px 12px 20px rgba(0, 0, 0, 0.08)',
    '0px 25px 50px rgba(0, 0, 0, 0.06), 0px 12px 20px rgba(0, 0, 0, 0.08)',
    '0px 25px 50px rgba(0, 0, 0, 0.06), 0px 12px 20px rgba(0, 0, 0, 0.08)',
    '0px 25px 50px rgba(0, 0, 0, 0.06), 0px 12px 20px rgba(0, 0, 0, 0.08)',
    '0px 25px 50px rgba(0, 0, 0, 0.06), 0px 12px 20px rgba(0, 0, 0, 0.08)',
    '0px 25px 50px rgba(0, 0, 0, 0.06), 0px 12px 20px rgba(0, 0, 0, 0.08)',
    '0px 25px 50px rgba(0, 0, 0, 0.06), 0px 12px 20px rgba(0, 0, 0, 0.08)',
    '0px 25px 50px rgba(0, 0, 0, 0.06), 0px 12px 20px rgba(0, 0, 0, 0.08)',
    '0px 25px 50px rgba(0, 0, 0, 0.06), 0px 12px 20px rgba(0, 0, 0, 0.08)',
    '0px 25px 50px rgba(0, 0, 0, 0.06), 0px 12px 20px rgba(0, 0, 0, 0.08)',
    '0px 25px 50px rgba(0, 0, 0, 0.06), 0px 12px 20px rgba(0, 0, 0, 0.08)',
    '0px 25px 50px rgba(0, 0, 0, 0.06), 0px 12px 20px rgba(0, 0, 0, 0.08)',
    '0px 25px 50px rgba(0, 0, 0, 0.06), 0px 12px 20px rgba(0, 0, 0, 0.08)',
    '0px 25px 50px rgba(0, 0, 0, 0.06), 0px 12px 20px rgba(0, 0, 0, 0.08)',
    '0px 25px 50px rgba(0, 0, 0, 0.06), 0px 12px 20px rgba(0, 0, 0, 0.08)',
    '0px 25px 50px rgba(0, 0, 0, 0.06), 0px 12px 20px rgba(0, 0, 0, 0.08)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f8fafc',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#c1c1c1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#a8a8a8',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#1a1a1a',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08), 0px 1px 2px rgba(0, 0, 0, 0.12)',
          borderBottom: '1px solid #e5e7eb',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e5e7eb',
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.04)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
        },
        elevation1: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.04), 0px 1px 2px rgba(0, 0, 0, 0.06)',
        },
        elevation2: {
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.04), 0px 2px 4px rgba(0, 0, 0, 0.06)',
        },
        elevation3: {
          boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.04), 0px 4px 6px rgba(0, 0, 0, 0.07)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          padding: '10px 24px',
          fontSize: '0.875rem',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.08), 0px 2px 4px rgba(0, 0, 0, 0.10)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 100%)',
          },
        },
        outlined: {
          borderWidth: '1px',
          '&:hover': {
            borderWidth: '1px',
            backgroundColor: 'rgba(21, 101, 192, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
          '&:hover': {
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease',
            boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.08), 0px 4px 6px rgba(0, 0, 0, 0.10)',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          margin: '2px 8px',
          '&.Mui-selected': {
            backgroundColor: 'rgba(21, 101, 192, 0.08)',
            borderLeft: '3px solid #1565C0',
            '&:hover': {
              backgroundColor: 'rgba(21, 101, 192, 0.12)',
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(21, 101, 192, 0.04)',
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#f8fafc',
            fontWeight: 600,
            fontSize: '0.875rem',
            borderBottom: '2px solid #e5e7eb',
            color: '#374151',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(21, 101, 192, 0.02)',
          },
          '&:nth-of-type(even)': {
            backgroundColor: 'rgba(248, 250, 252, 0.5)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: '6px',
        },
        outlined: {
          borderColor: '#d1d5db',
          '&:hover': {
            backgroundColor: 'rgba(21, 101, 192, 0.04)',
          },
        },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3B82F6', // Brighter blue for dark mode
      dark: '#1E40AF',
      light: '#60A5FA',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#10B981', // Professional green
      dark: '#059669',
      light: '#34D399',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0f172a', // Deep professional dark
      paper: '#1e293b',
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#94a3b8',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      letterSpacing: '0.01em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      letterSpacing: '0.01em',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
    caption: {
      fontSize: '0.75rem',
      letterSpacing: '0.03em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0f172a',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#1e293b',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#475569',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#64748b',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e293b',
          color: '#f1f5f9',
          borderBottom: '1px solid #334155',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1e293b',
          borderRight: '1px solid #334155',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1e293b',
          border: '1px solid #334155',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          padding: '10px 24px',
          fontSize: '0.875rem',
          fontWeight: 600,
          boxShadow: 'none',
        },
        contained: {
          background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          border: '1px solid #334155',
          background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
          '&:hover': {
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease',
            boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3), 0px 4px 6px rgba(0, 0, 0, 0.4)',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          margin: '2px 8px',
          '&.Mui-selected': {
            backgroundColor: 'rgba(59, 130, 246, 0.12)',
            borderLeft: '3px solid #3B82F6',
            '&:hover': {
              backgroundColor: 'rgba(59, 130, 246, 0.16)',
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(59, 130, 246, 0.08)',
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#0f172a',
            fontWeight: 600,
            fontSize: '0.875rem',
            borderBottom: '2px solid #334155',
            color: '#94a3b8',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(59, 130, 246, 0.08)',
          },
          '&:nth-of-type(even)': {
            backgroundColor: 'rgba(15, 23, 42, 0.3)',
          },
        },
      },
    },
  },
});

// App wrapper that uses preferences
const AppWithPreferences: React.FC = () => {
  const { preferences, updatePreferences } = useUserPreferences();

  const toggleTheme = () => {
    updatePreferences({ isDarkMode: !preferences.isDarkMode });
  };

  return (
    <ThemeProvider theme={preferences.isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/portfolio"
              element={
                <ProtectedRoute>
                  <Layout toggleTheme={toggleTheme} isDarkMode={preferences.isDarkMode}>
                    <PortfolioViewPage />
                  </Layout>
                </ProtectedRoute>
              }
            />            <Route
              path="/performance"
              element={
                <ProtectedRoute>
                  <Layout toggleTheme={toggleTheme} isDarkMode={preferences.isDarkMode}>
                    <PerformancePage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Layout toggleTheme={toggleTheme} isDarkMode={preferences.isDarkMode}>
                    <SettingsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/accounts"
              element={
                <ProtectedRoute>
                  <Layout toggleTheme={toggleTheme} isDarkMode={preferences.isDarkMode}>
                    <AccountsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/portfolio/:accountId"
              element={
                <ProtectedRoute>
                  <Layout toggleTheme={toggleTheme} isDarkMode={preferences.isDarkMode}>
                    <PortfolioViewPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-entry/:accountId"
              element={
                <ProtectedRoute>
                  <Layout toggleTheme={toggleTheme} isDarkMode={preferences.isDarkMode}>
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
};

export function App() {
  return (
    <UserPreferencesProvider>
      <AppWithPreferences />
    </UserPreferencesProvider>
  );
}

export default App;
