import React, { createContext, useContext, useState, useEffect } from 'react';
import { Currency, Country, CURRENCIES, COUNTRIES } from '../utils/constants';

export interface UserPreferences {
  defaultCurrency: Currency;
  defaultCountry: Country;
  isDarkMode: boolean;
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
}

const defaultPreferences: UserPreferences = {
  defaultCurrency: 'SGD',
  defaultCountry: 'Singapore',
  isDarkMode: true,
};

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }  return context;
};

const STORAGE_KEY = 'agnifolio_user_preferences';

export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedPreferences = localStorage.getItem(STORAGE_KEY);
      if (savedPreferences) {
        const parsed = JSON.parse(savedPreferences);
        // Validate that the saved preferences have valid values
        const validPreferences: UserPreferences = {
          defaultCurrency: CURRENCIES.includes(parsed.defaultCurrency) 
            ? parsed.defaultCurrency 
            : defaultPreferences.defaultCurrency,
          defaultCountry: COUNTRIES.includes(parsed.defaultCountry) 
            ? parsed.defaultCountry 
            : defaultPreferences.defaultCountry,
          isDarkMode: typeof parsed.isDarkMode === 'boolean' 
            ? parsed.isDarkMode 
            : defaultPreferences.isDarkMode,
        };
        setPreferences(validPreferences);
      }
    } catch (error) {
      console.error('Error loading user preferences:', error);
      setPreferences(defaultPreferences);
    }
  }, []);

  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    const updatedPreferences = { ...preferences, ...newPreferences };
    setPreferences(updatedPreferences);
    
    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPreferences));
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error resetting user preferences:', error);
    }
  };

  return (
    <UserPreferencesContext.Provider value={{ preferences, updatePreferences, resetPreferences }}>
      {children}
    </UserPreferencesContext.Provider>
  );
};
