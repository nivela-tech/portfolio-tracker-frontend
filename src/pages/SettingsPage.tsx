import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
  alpha,
  Card,
  CardContent,
  Chip,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Palette as PaletteIcon,
  AttachMoney as AttachMoneyIcon,
  Public as PublicIcon,
  Restore as RestoreIcon,
  Save as SaveIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import { CURRENCIES, COUNTRIES } from '../utils/constants';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const SettingsPage: React.FC = () => {
  const { user, authLoading, login } = useAuth();
  const { preferences, updatePreferences, resetPreferences } = useUserPreferences();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [localPreferences, setLocalPreferences] = useState(preferences);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  React.useEffect(() => {
    setLocalPreferences(preferences);
    setHasChanges(false);
  }, [preferences]);

  const handlePreferenceChange = <K extends keyof typeof localPreferences>(
    key: K,
    value: typeof localPreferences[K]
  ) => {
    const newPreferences = { ...localPreferences, [key]: value };
    setLocalPreferences(newPreferences);
    setHasChanges(true);
  };

  const handleSave = () => {
    updatePreferences(localPreferences);
    setHasChanges(false);
    setShowSaveSuccess(true);
  };

  const handleReset = () => {
    resetPreferences();
    setHasChanges(false);
  };

  if (authLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <LoadingSpinner variant="page" message="Loading settings..." />
      </Container>
    );
  }

  if (!user) {
    return (
      <Container sx={{ textAlign: 'center', mt: 5 }}>
        <Box sx={{ mb: 4 }}>
          <SettingsIcon sx={{ fontSize: 64, color: theme.palette.primary.main, mb: 2 }} />
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Settings
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Sign in to access and customize your preferences.
          </Typography>
          <Box
            onClick={login}
            component="button"
            sx={{
              border: 'none',
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: 'white',
              px: 4,
              py: 2,
              borderRadius: 2,
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
              }
            }}
          >
            Sign in with Google
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack 
          direction={isMobile ? "column" : "row"} 
          justifyContent="space-between" 
          alignItems={isMobile ? "flex-start" : "center"} 
          spacing={2}
        >
          <Box>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                }}
              >
                <SettingsIcon sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    mb: 0.5
                  }}
                >
                  Settings
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                  }}
                >
                  Customize your default preferences and application settings
                </Typography>
              </Box>
            </Stack>
          </Box>

          {hasChanges && (
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                onClick={handleReset}
                startIcon={<RestoreIcon />}
                size="small"
                sx={{ minWidth: 100 }}
              >
                Reset
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                startIcon={<SaveIcon />}
                size="small"
                sx={{ minWidth: 100 }}
              >
                Save
              </Button>
            </Stack>
          )}
        </Stack>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {/* Theme Settings Card */}
        <Card
          elevation={2}
          sx={{
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: `1px solid ${theme.palette.mode === 'dark' ? '#334155' : '#e5e7eb'}`,
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                    color: theme.palette.secondary.main,
                  }}
                >
                  <PaletteIcon />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Appearance
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Choose your preferred theme
                  </Typography>
                </Box>
              </Box>

              <Divider />

              <FormControlLabel
                control={
                  <Switch
                    checked={localPreferences.isDarkMode}
                    onChange={(e) => handlePreferenceChange('isDarkMode', e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Dark Mode
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Use dark theme for better viewing in low light
                    </Typography>
                  </Box>
                }
                sx={{ alignItems: 'flex-start', ml: 0 }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Chip
                  label={localPreferences.isDarkMode ? "Dark Theme Active" : "Light Theme Active"}
                  color={localPreferences.isDarkMode ? "secondary" : "primary"}
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Financial Defaults Card */}
        <Card
          elevation={2}
          sx={{
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: `1px solid ${theme.palette.mode === 'dark' ? '#334155' : '#e5e7eb'}`,
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                    color: theme.palette.success.main,
                  }}
                >
                  <AttachMoneyIcon />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Financial Defaults
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Set your preferred currency and country
                  </Typography>
                </Box>
              </Box>

              <Divider />

              <FormControl fullWidth size="small">
                <InputLabel>Default Currency</InputLabel>
                <Select
                  value={localPreferences.defaultCurrency}
                  label="Default Currency"
                  onChange={(e) => handlePreferenceChange('defaultCurrency', e.target.value as any)}
                  sx={{
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(15, 23, 42, 0.5)'
                      : 'rgba(248, 250, 252, 0.8)',
                    borderRadius: 2,
                  }}
                >
                  {CURRENCIES.map(currency => (
                    <MenuItem key={currency} value={currency}>
                      {currency}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Default Country</InputLabel>
                <Select
                  value={localPreferences.defaultCountry}
                  label="Default Country"
                  onChange={(e) => handlePreferenceChange('defaultCountry', e.target.value as any)}
                  sx={{
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(15, 23, 42, 0.5)'
                      : 'rgba(248, 250, 252, 0.8)',
                    borderRadius: 2,
                  }}
                >
                  {COUNTRIES.map(country => (
                    <MenuItem key={country} value={country}>
                      {country}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </CardContent>
        </Card>

        {/* User Profile Card */}
        <Card
          elevation={2}
          sx={{
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: `1px solid ${theme.palette.mode === 'dark' ? '#334155' : '#e5e7eb'}`,
            borderRadius: 3,
            gridColumn: { xs: '1', md: '1 / -1' }
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.main,
                  }}
                >
                  <PublicIcon />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Account Information
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your current account details
                  </Typography>
                </Box>
              </Box>

              <Divider />              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    NAME
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {user.name}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    EMAIL
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {user.email}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Current Settings Summary */}
      {!hasChanges && (
        <Paper
          elevation={1}
          sx={{
            mt: 4,
            p: 3,
            background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
            border: `1px solid ${alpha(theme.palette.success.main, 0.12)}`,
            borderRadius: 3,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: 500,
              textAlign: 'center',
            }}
          >
            ✅ Your preferences are saved and will be applied across all pages. 
            Changes are automatically synchronized with your browser's local storage.
          </Typography>
        </Paper>
      )}

      {/* Success Snackbar */}
      <Snackbar
        open={showSaveSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSaveSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSaveSuccess(false)} 
          severity="success" 
          sx={{ width: '100%' }}
          icon={<CheckIcon />}
        >
          Settings saved successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};
