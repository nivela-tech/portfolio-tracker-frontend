import React from 'react';
import { PortfolioTable } from './PortfolioTable';
import { PortfolioChart } from './PortfolioChart';
import { PortfolioEntry } from '../types/portfolio';

interface PortfolioContentProps {
    entries: PortfolioEntry[];
    chartType: 'pie' | 'bar';
    groupBy: 'type' | 'currency' | 'country' | 'source';
    selectedCurrency: string;
    loading: boolean;
    showGraph: boolean;
    onEdit: (entry: PortfolioEntry) => void;
    onDelete: (entryId: string) => void;
}

export const PortfolioContent: React.FC<PortfolioContentProps> = ({
    entries,
    chartType,
    groupBy,
    selectedCurrency,
    loading,
    showGraph,
    onEdit,
    onDelete
}) => {
    return (
        <>
            {showGraph && (
                <PortfolioChart 
                    entries={entries} 
                    chartType={chartType} 
                    groupBy={groupBy} 
                    selectedCurrency={selectedCurrency} 
                />
            )}
            <PortfolioTable 
                entries={entries} 
                onEdit={onEdit} 
                onDelete={onDelete} 
                selectedCurrency={selectedCurrency} 
                loading={loading} 
            />
        </>
    );
};

export {};
