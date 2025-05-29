import React from 'react';
import { NetWorthBox } from './NetWorthBox';

interface NetWorthSectionProps {
    totalNetWorth: number;
    selectedCurrency: string;
    onCurrencyChange: (currency: string) => void;
}

export const NetWorthSection: React.FC<NetWorthSectionProps> = ({ totalNetWorth, selectedCurrency, onCurrencyChange }) => {
    return (
        <NetWorthBox 
            totalNetWorth={totalNetWorth}
            selectedCurrency={selectedCurrency}
            onCurrencyChange={onCurrencyChange}
        />
    );
};

export {};
