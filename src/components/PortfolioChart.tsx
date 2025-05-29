import React from 'react';
import { Box, useTheme, useMediaQuery, alpha } from '@mui/material';
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
        
        // Professional color palette for banking applications
        const professionalColors = [
            theme.palette.primary.main,     // Professional blue
            theme.palette.success.main,     // Professional green
            theme.palette.warning.main,     // Professional orange
            theme.palette.info.main,        // Professional cyan
            theme.palette.secondary.main,   // Professional purple
            alpha(theme.palette.primary.main, 0.7),
            alpha(theme.palette.success.main, 0.7),
            alpha(theme.palette.warning.main, 0.7),
            alpha(theme.palette.info.main, 0.7),
            alpha(theme.palette.secondary.main, 0.7),
        ];

        const colors = labels.map((_, index) => 
            professionalColors[index % professionalColors.length]
        );

        const borderColors = colors.map(color => 
            typeof color === 'string' ? color : alpha(theme.palette.primary.main, 0.8)
        );        return {
            labels,
            datasets: [{
                label: `Portfolio Value by ${groupBy.charAt(0).toUpperCase() + groupBy.slice(1)}`,
                data,
                backgroundColor: colors.map(color => alpha(color, 0.8)),
                borderColor: borderColors,
                borderWidth: 2,
                memberDetails
            }]
        } as ChartData;
    };

    const chartData = prepareChartData();    const baseOptions = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                position: isMobile ? 'bottom' as const : 'right' as const,
                labels: {
                    boxWidth: isMobile ? 12 : 16,
                    padding: isMobile ? 10 : 20,
                    font: {
                        size: isMobile ? 10 : 13,
                        family: 'Inter, sans-serif',
                        weight: 600 as const
                    },
                    color: theme.palette.text.primary,
                    usePointStyle: true,
                    pointStyle: 'circle' as const
                }
            },
            tooltip: {
                backgroundColor: alpha(theme.palette.background.paper, 0.95),
                titleColor: theme.palette.text.primary,
                bodyColor: theme.palette.text.secondary,
                borderColor: alpha(theme.palette.primary.main, 0.2),
                borderWidth: 1,
                cornerRadius: 8,
                padding: 12,
                titleFont: {
                    size: isMobile ? 12 : 14,
                    family: 'Inter, sans-serif',
                    weight: 600 as const
                },
                bodyFont: {
                    size: isMobile ? 10 : 12,
                    family: 'Inter, sans-serif',
                    weight: 500 as const
                },
                callbacks: {
                    title: (context: any) => {
                        return `${context[0].label}`;
                    },
                    label: (context: any) => {
                        const value = context.parsed.y ?? context.parsed;
                        const dataset = context.dataset;
                        const memberDetails = dataset.memberDetails?.[context.dataIndex] ?? {};
                        const percentage = ((value / dataset.data.reduce((a: number, b: number) => a + b, 0)) * 100).toFixed(1);
                        
                        const lines = [
                            `Total: ${new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: selectedCurrency,
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            }).format(value)} (${percentage}%)`
                        ];
                        
                        if (!isMobile && Object.keys(memberDetails as Record<string, number>).length > 1) {
                            lines.push(''); // Empty line for separation
                            lines.push('Breakdown by Account:');
                            Object.entries(memberDetails as Record<string, number>).forEach(([member, amount]) => {
                                lines.push(`  ${member}: ${new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: selectedCurrency,
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }).format(Number(amount))}`);
                            });
                        }
                        
                        return lines;
                    }
                }
            }
        }
    };    const barOptions = {
        ...baseOptions,
        plugins: {
            ...baseOptions.plugins,
            legend: {
                ...baseOptions.plugins.legend,
                position: isMobile ? 'bottom' as const : 'top' as const
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: alpha(theme.palette.divider, 0.1),
                    lineWidth: 1
                },
                ticks: {
                    font: {
                        size: isMobile ? 10 : 12,
                        family: 'Inter, sans-serif',
                        weight: 500 as const
                    },
                    color: theme.palette.text.secondary,
                    callback: function(this: any, value: number | string) {
                        if (typeof value === 'number') {
                            return new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: selectedCurrency,
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                                notation: value >= 1000000 ? 'compact' : 'standard'
                            }).format(value);
                        }
                        return value;
                    }
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: isMobile ? 10 : 12,
                        family: 'Inter, sans-serif',
                        weight: 600 as const
                    },
                    color: theme.palette.text.primary,
                    maxRotation: isMobile ? 45 : 0
                }
            }
        },
        indexAxis: 'x' as const,
    };return (
        <Box 
            sx={{ 
                width: '100%', 
                height: isMobile ? 350 : 450,
                mb: isMobile ? 2 : 0,
                p: 2,
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
                boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.06)}`
            }}
        >
            {chartType === 'pie' ? (
                <Pie data={chartData} options={baseOptions} />
            ) : (
                <Bar data={chartData} options={barOptions} />
            )}
        </Box>
    );
};
