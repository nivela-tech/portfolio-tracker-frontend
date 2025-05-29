import React from 'react';
import { Box, Typography, ToggleButtonGroup, ToggleButton, useTheme, useMediaQuery, Stack } from '@mui/material';
import PieChartIcon from '@mui/icons-material/PieChart';
import BarChartIcon from '@mui/icons-material/BarChart';

interface ChartControlsProps {
  chartType: 'pie' | 'bar';
  groupBy: 'type' | 'currency' | 'country' | 'source';
  setChartType: (type: 'pie' | 'bar') => void;
  setGroupBy: (group: 'type' | 'currency' | 'country' | 'source') => void;
}

export const ChartControls: React.FC<ChartControlsProps> = ({ chartType, groupBy, setChartType, setGroupBy }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box 
      display="flex" 
      flexDirection={isMobile ? "column" : "row"}
      justifyContent={isMobile ? "center" : "space-between"} 
      alignItems={isMobile ? "stretch" : "center"}
      gap={isMobile ? 2 : 0}
      mb={2}
    >
      <Stack 
        direction={isMobile ? "column" : "row"} 
        spacing={isMobile ? 2 : 2} 
        alignItems={isMobile ? "stretch" : "center"}
        width={isMobile ? "100%" : "auto"}
      >
        <Box textAlign={isMobile ? "center" : "left"}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Chart Type
          </Typography>
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={(e, value) => value && setChartType(value)}
            size="small"
            fullWidth={isMobile}
          >
            <ToggleButton value="pie">
              <PieChartIcon />
              {isMobile && <Typography variant="caption" sx={{ ml: 1 }}>Pie</Typography>}
            </ToggleButton>
            <ToggleButton value="bar">
              <BarChartIcon />
              {isMobile && <Typography variant="caption" sx={{ ml: 1 }}>Bar</Typography>}
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box textAlign={isMobile ? "center" : "left"}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Group By
          </Typography>
          <ToggleButtonGroup
            value={groupBy}
            exclusive
            onChange={(e, value) => value && setGroupBy(value)}
            size="small"
            orientation={isMobile ? "vertical" : "horizontal"}
            fullWidth={isMobile}
          >
            <ToggleButton value="type">Type</ToggleButton>
            <ToggleButton value="currency">Currency</ToggleButton>
            <ToggleButton value="country">Country</ToggleButton>
            <ToggleButton value="source">Source</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Stack>
    </Box>
  );
};

export {};
