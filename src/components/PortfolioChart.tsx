import React from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { PortfolioEntry, ChartData } from '../types/portfolio';
import { convertCurrency } from '../utils/currencyConverter';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface PortfolioChartProps {
    entries: PortfolioEntry[];
    chartType: 'pie' | 'bar';
    groupBy: 'type' | 'currency' | 'country' | 'source';
    selectedCurrency: string;
}

export const PortfolioChart: React.FC<PortfolioChartProps> = ({ 
    entries, 
    chartType, 
    groupBy,
    selectedCurrency 
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const prepareChartData = (): ChartData => {
        if (!entries || entries.length === 0) {
            return {
                labels: [],
                datasets: [{
                    label: 'No Data',
                    data: [],
                    backgroundColor: [],
                    borderColor: [],
                    borderWidth: 1
                }]
            };
        }

        // Group data based on the selected grouping criteria
        const groupedData = entries.reduce((acc, entry) => {
            let key;
            if (groupBy === 'type') {
                key = entry.type;
            } else if (groupBy === 'currency') {
                key = entry.currency;
            } else if (groupBy === 'country') {
                key = entry.country;
            } else {
                // groupBy === 'source'
                key = entry.source;
            }

            const convertedAmount = convertCurrency(entry.amount, entry.currency, selectedCurrency);
            
            if (!acc[key]) {
                acc[key] = {
                    total: 0,
                    byMember: {}
                };
            }
            acc[key].total += convertedAmount;
            
            // Track amounts by member for tooltip
            const memberName = entry.account?.name || 'Unknown';
            if (!acc[key].byMember[memberName]) {
                acc[key].byMember[memberName] = 0;
            }
            acc[key].byMember[memberName] += convertedAmount;
            
            return acc;
        }, {} as Record<string, { total: number, byMember: Record<string, number> }>);        const labels = Object.keys(groupedData);
        const data = labels.map(label => groupedData[label].total);
        const memberDetails = labels.map(label => groupedData[label].byMember);
        const colors = labels.map(() => 
            `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`
        );

        return {
            labels,
            datasets: [{
                label: `Total by ${groupBy}`,
                data,
                backgroundColor: colors,
                borderColor: colors,
                borderWidth: 1,
                memberDetails
            }]
        } as ChartData;
    };

    const chartData = prepareChartData();
      const baseOptions = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                position: isMobile ? 'bottom' as const : 'top' as const,
                labels: {
                    boxWidth: isMobile ? 12 : 20,
                    padding: isMobile ? 10 : 20,
                    font: {
                        size: isMobile ? 10 : 12
                    }
                }
            },
            tooltip: {
                titleFont: {
                    size: isMobile ? 12 : 14
                },
                bodyFont: {
                    size: isMobile ? 10 : 12
                },
                callbacks: {
                    label: (context: any) => {
                        const value = context.parsed.y ?? context.parsed;
                        const dataset = context.dataset;
                        const memberDetails = dataset.memberDetails?.[context.dataIndex] ?? {};
                        
                        const lines = [
                            `Total: ${selectedCurrency} ${value.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}`
                        ];
                        
                        if (!isMobile) {
                            Object.entries(memberDetails as Record<string, number>).forEach(([member, amount]) => {
                                lines.push(`${member}: ${selectedCurrency} ${Number(amount).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}`);
                            });
                        }
                        
                        return lines;
                    }
                }
            }
        }
    };    const barOptions = {
        ...baseOptions,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    font: {
                        size: isMobile ? 10 : 12
                    },
                    callback: function(this: any, value: number | string) {
                        if (typeof value === 'number') {
                            return `${selectedCurrency} ${value.toLocaleString(undefined, {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            })}`;
                        }
                        return value;
                    }
                }
            },
            x: {
                ticks: {
                    font: {
                        size: isMobile ? 10 : 12
                    },
                    maxRotation: isMobile ? 45 : 0
                }
            }
        },
        indexAxis: 'x' as const,
    };

    return (
        <Box sx={{ 
            width: '100%', 
            height: isMobile ? 300 : 400,
            mb: isMobile ? 2 : 0
        }}>
            {chartType === 'pie' ? (
                <Pie data={chartData} options={baseOptions} />
            ) : (
                <Bar data={chartData} options={barOptions} />
            )}
        </Box>
    );
};
