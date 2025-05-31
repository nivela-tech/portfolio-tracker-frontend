import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Grid, 
  Slider, 
  InputAdornment,
  FormControl,
  FormLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  Divider,  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Chip,
  Alert,
  AlertTitle,
  Collapse,
  IconButton
} from '@mui/material';
import { 
  CalculateOutlined as CalculateIcon,
  TrendingUp as TrendingUpIcon,
  MonetizationOn as MonetizationOnIcon,
  Timeline as TimelineIcon,
  ExpandLess,
  ExpandMore,
  Build as BuildIcon,
  Settings as SettingsIcon,
  TuneOutlined as TuneIcon
} from '@mui/icons-material';

export const FireCalculatorPage: React.FC = () => {
  const theme = useTheme();
  
  // FIRE Calculator state
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [currentSavings, setCurrentSavings] = useState<number>(100000);
  const [annualIncome, setAnnualIncome] = useState<number>(60000);
  const [annualExpenses, setAnnualExpenses] = useState<number>(40000);
  const [savingsRate, setSavingsRate] = useState<number>(20);
  const [returnRate, setReturnRate] = useState<number>(7);
  const [inflationRate, setInflationRate] = useState<number>(2);
  const [withdrawalRate, setWithdrawalRate] = useState<number>(4);
    // New state for advanced features
  const [expenseGrowth, setExpenseGrowth] = useState<boolean>(true); // Whether expenses grow with inflation
  const [nominalCalculation, setNominalCalculation] = useState<boolean>(false); // True for nominal, false for real
  const [showAdvancedSettings, setShowAdvancedSettings] = useState<boolean>(false); // Toggle for advanced settings
  
  // Results
  const [yearsToFI, setYearsToFI] = useState<number | null>(null);
  const [targetAmount, setTargetAmount] = useState<number | null>(null);
  const [projectedData, setProjectedData] = useState<any[]>([]);
  
  // Force a re-render when calculateFI is called
  const [forceUpdate, setForceUpdate] = useState(0);  // Calculate Financial Independence
  const calculateFI = useCallback(() => {
    // Validate inputs - check for null/undefined, not falsy values since 0 is valid
    if (currentAge == null || annualIncome == null || annualExpenses == null || 
        savingsRate == null || returnRate == null || inflationRate == null || withdrawalRate == null) {
      return;
    }
    
    // Also validate that we have meaningful values
    if (annualIncome <= 0 || annualExpenses <= 0 || withdrawalRate <= 0) {
      return;
    }
    
    // Calculate annual savings amount
    const annualSavings = annualIncome * (savingsRate / 100);
    
    // Calculate target amount needed for financial independence
    // If expense growth is enabled, we use current expenses as the base
    // If disabled, we use inflation-adjusted expenses at retirement
    let targetFIAmount: number;
    if (expenseGrowth) {
      // Expenses will grow with inflation, so we need to account for future expenses
      // This is more complex and requires iterative calculation
      targetFIAmount = annualExpenses / (withdrawalRate / 100);
    } else {
      // Expenses stay constant in today's dollars
      targetFIAmount = annualExpenses / (withdrawalRate / 100);
    }
    
    // If current savings already meets target, set years to 0
    if (currentSavings >= targetFIAmount) {
      setYearsToFI(0);
      setTargetAmount(Math.round(targetFIAmount));
      setProjectedData([{
        year: 0,
        age: currentAge,
        savings: currentSavings,
        contributions: 0,
        returns: 0,
        percentComplete: 100
      }]);
      return;
    }
    
    // Calculate years to financial independence
    let currentAmount = currentSavings;
    let years = 0;
    
    // Determine effective return rate based on calculation mode
    const effectiveReturnRate = nominalCalculation 
      ? returnRate / 100  // Use nominal rate directly
      : (1 + returnRate/100) / (1 + inflationRate/100) - 1; // Real return rate
    
    const projectedResults = [];
    
    // Add starting year data
    projectedResults.push({
      year: 0,
      age: currentAge,
      savings: Math.round(currentAmount),
      contributions: 0,
      returns: 0,
      percentComplete: Math.min(Math.round((currentAmount / targetFIAmount) * 100), 100)
    });
    
    // For expense growth calculations, we need to iterate and adjust target
    let currentTargetExpenses = annualExpenses;
    
    while (currentAmount < targetFIAmount && years < 100) {
      years++;
      
      // If expense growth is enabled, increase target expenses with inflation
      if (expenseGrowth) {
        currentTargetExpenses = annualExpenses * Math.pow(1 + inflationRate/100, years);
        targetFIAmount = currentTargetExpenses / (withdrawalRate / 100);
      }
      
      // Calculate contributions and returns for this year
      let yearlyContribution = annualSavings;
      if (nominalCalculation) {
        // In nominal mode, increase contributions with inflation to maintain purchasing power
        yearlyContribution = annualSavings * Math.pow(1 + inflationRate/100, years);
      }
      
      const yearlyReturn = currentAmount * effectiveReturnRate;
      currentAmount = currentAmount + yearlyContribution + yearlyReturn;
      
      projectedResults.push({
        year: years,
        age: currentAge + years,
        savings: Math.round(currentAmount),
        contributions: Math.round(yearlyContribution),
        returns: Math.round(yearlyReturn),
        percentComplete: Math.min(Math.round((currentAmount / targetFIAmount) * 100), 100)
      });
      
      if (projectedResults.length > 50) break; // Limit to 50 years for UI
    }
    
    // Update state with calculated values
    setYearsToFI(years);
    setTargetAmount(Math.round(targetFIAmount));
    setProjectedData([...projectedResults]);
    
    // Force a re-render to ensure the UI updates
    setForceUpdate(prev => prev + 1);
  }, [currentAge, currentSavings, annualIncome, annualExpenses, savingsRate, returnRate, inflationRate, withdrawalRate, expenseGrowth, nominalCalculation, setForceUpdate]);  // Format currency without dollar symbol
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0
    }).format(value);
  };
  // Auto-calculate when any input values change
  useEffect(() => {
    calculateFI();
  }, [calculateFI]);
  
  const handleCalculate = () => {
    calculateFI();
    setForceUpdate(prev => prev + 1);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box mb={4}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          <CalculateIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          FIRE Calculator
        </Typography>        <Typography variant="body1" color="text.secondary" mb={2}>
          Calculate your path to Financial Independence and Retire Early (FIRE)
        </Typography>
        
        <Divider />
      </Box>

      <Grid container spacing={4}>
        {/* Input Section */}
        <Grid size={{ xs: 12, md: 6, lg: 5 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: theme.shadows[1],
              height: '100%'
            }}
          >
            <Typography variant="h6" fontWeight={600} mb={3}>
              Your Financial Information
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Current Age"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(Number(e.target.value))}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box sx={{ color: 'text.secondary', fontSize: 18 }}>
                          Age
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Current Savings"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(Number(e.target.value))}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Annual Income"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(Number(e.target.value))}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Annual Expenses"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={annualExpenses}
                  onChange={(e) => setAnnualExpenses(Number(e.target.value))}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <FormLabel id="savings-rate-slider">
                    Savings Rate: {savingsRate}%
                  </FormLabel>
                  <Slider
                    aria-labelledby="savings-rate-slider"
                    value={savingsRate}
                    onChange={(_, newValue) => setSavingsRate(newValue as number)}
                    min={0}
                    max={80}
                    step={1}
                    marks={[
                      { value: 0, label: '0%' },
                      { value: 20, label: '20%' },
                      { value: 40, label: '40%' },
                      { value: 60, label: '60%' },
                      { value: 80, label: '80%' },
                    ]}
                  />
                </FormControl>
              </Grid>              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label={nominalCalculation ? "Investment Return Rate (Nominal)" : "Investment Return Rate (Real)"}
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={returnRate}
                  onChange={(e) => setReturnRate(Number(e.target.value))}
                  helperText={nominalCalculation 
                    ? "Expected annual return including inflation effects" 
                    : "Expected annual return above inflation"
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          %
                          <Chip 
                            label={nominalCalculation ? "Nominal" : "Real"} 
                            size="small" 
                            color={nominalCalculation ? "secondary" : "primary"}
                            variant="outlined"
                          />
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Inflation Rate"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Number(e.target.value))}
                  helperText="Expected annual inflation rate"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <FormLabel id="withdrawal-rate-slider">
                    Safe Withdrawal Rate: {withdrawalRate}%
                  </FormLabel>
                  <Slider
                    aria-labelledby="withdrawal-rate-slider"
                    value={withdrawalRate}
                    onChange={(_, newValue) => setWithdrawalRate(newValue as number)}
                    min={2}
                    max={6}
                    step={0.1}
                    marks={[
                      { value: 2, label: '2%' },
                      { value: 3, label: '3%' },
                      { value: 4, label: '4%' },
                      { value: 5, label: '5%' },
                      { value: 6, label: '6%' },
                    ]}
                  />
                </FormControl>
              </Grid>              <Grid size={{ xs: 12 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<CalculateIcon />}
                  onClick={handleCalculate}
                  fullWidth
                  sx={{
                    py: 1.5,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    boxShadow: theme.shadows[3],
                    '&:hover': {
                      boxShadow: theme.shadows[5],
                    },
                  }}
                >
                  Calculate Path to FIRE
                </Button>
              </Grid>

              {/* Advanced Settings Section */}
              <Grid size={{ xs: 12 }}>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="text"
                    onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                    startIcon={<TuneIcon />}
                    endIcon={showAdvancedSettings ? <ExpandLess /> : <ExpandMore />}
                    sx={{
                      color: 'text.secondary',
                      textTransform: 'none',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.04)',
                      },
                    }}
                  >
                    Advanced Settings
                  </Button>
                  
                  <Collapse in={showAdvancedSettings}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        mt: 2,
                        borderRadius: 2,
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                        border: '1px solid',
                        borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight={600} mb={3} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SettingsIcon fontSize="small" />
                        Calculation Mode Settings
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={expenseGrowth}
                              onChange={(e) => setExpenseGrowth(e.target.checked)}
                              color="primary"
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="body2" fontWeight={500}>
                                Expense Growth with Inflation
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {expenseGrowth ? 'Expenses will increase with inflation over time' : 'Expenses stay constant in today\'s dollars'}
                              </Typography>
                            </Box>
                          }
                        />
                        
                        <FormControlLabel
                          control={
                            <Switch
                              checked={nominalCalculation}
                              onChange={(e) => setNominalCalculation(e.target.checked)}
                              color="secondary"
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="body2" fontWeight={500}>
                                Nominal Projections
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {nominalCalculation ? 'Show future dollar amounts (nominal)' : 'Show inflation-adjusted amounts (real)'}
                              </Typography>
                            </Box>
                          }
                        />
                        
                        <Alert 
                          severity="info" 
                          sx={{ 
                            mt: 1,
                            '& .MuiAlert-message': {
                              fontSize: '0.8rem'
                            }
                          }}
                        >
                          <Typography variant="caption">
                            <strong>Tip:</strong> Most FIRE calculations use real (inflation-adjusted) returns with expenses that grow with inflation. 
                            Nominal calculations show future dollar amounts but may be less intuitive for planning.
                          </Typography>
                        </Alert>
                      </Box>
                    </Paper>
                  </Collapse>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Results Section */}
        <Grid size={{ xs: 12, md: 6, lg: 7 }}>
          {/* Force rerender with key based on forceUpdate */}
          <div key={forceUpdate}>          {yearsToFI !== null && (
              <Box>
                {/* Information Alert - only show if advanced settings are visible or non-default values are used */}
                {(showAdvancedSettings || !expenseGrowth || nominalCalculation) && (
                  <Alert 
                    severity="info" 
                    sx={{ mb: 3, borderRadius: 2 }}
                  >
                    <AlertTitle>Calculation Mode</AlertTitle>
                    <Typography variant="body2">
                      <strong>Projection Type:</strong> {nominalCalculation ? 'Nominal' : 'Real'} (inflation-{nominalCalculation ? 'inclusive' : 'adjusted'}) values
                      {' • '}
                      <strong>Expense Growth:</strong> {expenseGrowth ? 'Expenses grow with inflation' : 'Expenses stay constant in today\'s dollars'}
                      {' • '}
                      <strong>Return Rate:</strong> {nominalCalculation ? 'Nominal' : 'Real'} returns ({returnRate}% {nominalCalculation ? 'including' : 'above'} inflation)
                    </Typography>
                  </Alert>
                )}

                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        height: '100%',
                        borderRadius: 2,
                        boxShadow: theme.shadows[1],
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        color: 'white'
                      }}
                    >                      <CardContent sx={{ p: 3 }}>
                        <Box display="flex" alignItems="center" mb={1}>
                          <TimelineIcon sx={{ mr: 1 }} />
                          <Typography variant="overline" fontSize="0.75rem">
                            Financial Independence Timeline
                          </Typography>
                        </Box>
                        <Typography variant="h5" fontWeight={600} gutterBottom sx={{ lineHeight: 1.3 }}>
                          You can achieve Financial Independence in
                        </Typography>
                        <Typography variant="h3" fontWeight={700} gutterBottom>
                          {yearsToFI} Years by Age {yearsToFI !== null ? currentAge + yearsToFI : 'Calculating...'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        height: '100%',
                        borderRadius: 2,
                        boxShadow: theme.shadows[1],
                        background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
                        color: 'white' 
                      }}
                    >                      <CardContent sx={{ p: 3 }}>
                        <Box display="flex" alignItems="center" mb={1}>
                          <TrendingUpIcon sx={{ mr: 1 }} />
                          <Typography variant="overline" fontSize="0.75rem">
                            Target FIRE Amount
                          </Typography>
                        </Box>
                        <Typography variant="h3" fontWeight={700} gutterBottom>
                          {targetAmount && formatCurrency(targetAmount)}
                        </Typography>
                        <Typography variant="body2">
                          Annual withdrawal: {formatCurrency((targetAmount || 0) * (withdrawalRate / 100))}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Projection Table */}
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    boxShadow: theme.shadows[1],
                    overflow: 'hidden'
                  }}
                >
                  <Box p={2} bgcolor={theme.palette.background.default}>
                    <Typography variant="h6" fontWeight={600}>
                      <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Projected Growth Path
                    </Typography>
                  </Box>
                  <TableContainer sx={{ maxHeight: 400 }}>
                    <Table stickyHeader aria-label="FIRE projection table" size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Year</TableCell>
                          <TableCell>Age</TableCell>
                          <TableCell align="right">Savings</TableCell>
                          <TableCell align="right">Annual Contribution</TableCell>
                          <TableCell align="right">Annual Return</TableCell>
                          <TableCell align="right">% Complete</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {projectedData.map((row) => (
                          <TableRow key={row.year} hover>
                            <TableCell>{row.year}</TableCell>
                            <TableCell>{row.age}</TableCell>
                            <TableCell align="right">{formatCurrency(row.savings)}</TableCell>
                            <TableCell align="right">{formatCurrency(row.contributions)}</TableCell>
                            <TableCell align="right">{formatCurrency(row.returns)}</TableCell>
                            <TableCell align="right">
                              {row.percentComplete}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Box>
            )}

            {yearsToFI === null && (
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 2,
                  boxShadow: theme.shadows[1],
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'
                }}
              >
                <CalculateIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.6 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Fill in your financial information
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Enter your details and calculate your path to Financial Independence
                </Typography>
              </Paper>
            )}
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};
