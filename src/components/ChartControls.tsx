import React from 'react';
import { Box, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';
import PieChartIcon from '@mui/icons-material/PieChart';
import BarChartIcon from '@mui/icons-material/BarChart';

interface ChartControlsProps {
  chartType: 'pie' | 'bar';
  groupBy: 'type' | 'currency' | 'country' | 'source';
  setChartType: (type: 'pie' | 'bar') => void;
  setGroupBy: (group: 'type' | 'currency' | 'country' | 'source') => void;
}

export const ChartControls: React.FC<ChartControlsProps> = ({ chartType, groupBy, setChartType, setGroupBy }) => (
  <Box display="flex" justifyContent="space-between" alignItems="center">
    <Box display="flex" gap={2} alignItems="center">
      <Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Chart Type
        </Typography>
        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={(e, value) => value && setChartType(value)}
          size="small"
        >
          <ToggleButton value="pie">
            <PieChartIcon />
          </ToggleButton>
          <ToggleButton value="bar">
            <BarChartIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Group By
        </Typography>
        <ToggleButtonGroup
          value={groupBy}
          exclusive
          onChange={(e, value) => value && setGroupBy(value)}
          size="small"
        >
          <ToggleButton value="type">Type</ToggleButton>
          <ToggleButton value="currency">Currency</ToggleButton>
          <ToggleButton value="country">Country</ToggleButton>
          <ToggleButton value="source">Source</ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Box>
  </Box>
);

export {};
