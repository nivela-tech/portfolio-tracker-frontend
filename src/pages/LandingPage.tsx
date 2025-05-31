import React, { useEffect, useState } from 'react';
import { 
  Box,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  Stack,
  useTheme,
  useMediaQuery,
  alpha,
  Avatar,
  Paper,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  Link,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Snackbar,
  Alert
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingUpIcon,
  Analytics as AnalyticsIcon,
  Shield as ShieldIcon,
  Verified as VerifiedIcon,
  Google as GoogleIcon,
  ExpandMore as ExpandMoreIcon,
  Policy as PolicyIcon,
  Gavel as GavelIcon,
  Lock as LockIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as LanguageIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  Whatshot as FireIcon,
  Rocket as RocketIcon,
  TrackChanges as TargetIcon,
  AutoGraph as GrowthIcon,
  Speed as SpeedIcon,
  EmojiEvents as TrophyIcon
} from '@mui/icons-material';
import { useAuth } from '../components/Layout';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const { login, isAuthenticated, authLoading } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Legal dialog states
  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false);
  const [termsDialogOpen, setTermsDialogOpen] = useState(false);
  const [gdprDialogOpen, setGdprDialogOpen] = useState(false);
  const [cookieDialogOpen, setCookieDialogOpen] = useState(false);
  const [gdprAccepted, setGdprAccepted] = useState(false);
  const [cookiesAccepted, setCookiesAccepted] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate('/portfolio');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Check for GDPR and cookie consent
  useEffect(() => {
    const gdprConsent = localStorage.getItem('gdpr-consent');
    const cookieConsent = localStorage.getItem('cookie-consent');
    
    if (!gdprConsent) {
      setGdprDialogOpen(true);
    } else {
      setGdprAccepted(true);
    }
    
    if (!cookieConsent) {
      setCookieDialogOpen(true);
    } else {
      setCookiesAccepted(true);
    }
  }, []);

  const handleGdprAccept = () => {
    localStorage.setItem('gdpr-consent', 'accepted');
    setGdprAccepted(true);
    setGdprDialogOpen(false);
  };

  const handleCookieAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setCookiesAccepted(true);
    setCookieDialogOpen(false);
  };

  if (authLoading) {
    return (      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="100vh"
        sx={{
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
            : 'linear-gradient(135deg, #1a365d 0%, #2d3748 100%)'
        }}
      >
        <Typography variant="h6" color="white">Loading...</Typography>
      </Box>
    );
  }  const features = [
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      title: 'Track All Your Assets',
      description: 'Monitor stocks, crypto, real estate, savings, and more in one unified dashboard with real-time updates.'
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
      title: 'Smart Analytics',
      description: 'Get insights into your portfolio performance with advanced analytics and beautiful visualizations.'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Secure & Private',
      description: 'Industry-leading security protects your data while you maintain complete control over your financial information.'
    }
  ];

  if (!isAuthenticated) {
    return (
      <>
        {/* Professional Header */}
        <AppBar 
          position="sticky" 
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, #1a365d 0%, #2d3748 100%)',
            borderBottom: `1px solid ${alpha('#ffffff', 0.1)}`
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                sx={{
                  bgcolor: '#ff6b35',
                  color: '#ffffff',
                  width: 40,
                  height: 40,
                  fontWeight: 'bold'
                }}
              >
                <FireIcon />
              </Avatar>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  color: '#ffffff',
                  letterSpacing: '-0.02em'
                }}
              >
                Agni Folio
              </Typography>              <Chip
                icon={<RocketIcon />}
                label="All-in-One Tracker"
                size="small"
                sx={{
                  bgcolor: alpha('#ff6b35', 0.2),
                  color: '#ffffff',
                  fontWeight: 600,
                  border: `1px solid ${alpha('#ff6b35', 0.3)}`
                }}
              />
            </Box>
            
            <Stack direction="row" spacing={3} alignItems="center">
              <Button
                color="inherit"
                onClick={() => setPrivacyDialogOpen(true)}
                sx={{ textTransform: 'none', fontWeight: 500 }}
              >
                Privacy
              </Button>
              <Button
                color="inherit"
                onClick={() => setTermsDialogOpen(true)}
                sx={{ textTransform: 'none', fontWeight: 500 }}
              >
                Terms
              </Button>
              <Button
                variant="outlined"
                onClick={login}
                startIcon={<GoogleIcon />}
                sx={{
                  color: '#ffffff',
                  borderColor: alpha('#ffffff', 0.3),
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#ffffff',
                    bgcolor: alpha('#ffffff', 0.1)
                  }
                }}
              >
                Sign In
              </Button>
            </Stack>
          </Toolbar>
        </AppBar>        {/* Main Content */}
        <Box
          sx={{
            minHeight: 'calc(100vh - 64px)',
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
              : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: theme.palette.mode === 'dark'
                ? 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23334155" fill-opacity="0.08"%3E%3Cpath d="m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
                : 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.03"%3E%3Cpath d="m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              opacity: theme.palette.mode === 'dark' ? 0.6 : 0.4
            }
          }}
        >
          {/* Hero Section */}          <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ py: { xs: 8, md: 12 } }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'center',
                gap: 6
              }}>
                {/* Left Column - Hero Content */}
                <Box sx={{ flex: 1, width: '100%' }}>
                  <Stack spacing={4}>                    <Box>                      <Typography 
                        variant={isMobile ? "h3" : "h1"} 
                        sx={{ 
                          fontWeight: 800,
                          color: theme.palette.text.primary,
                          mb: 3,
                          lineHeight: 1.1,
                          background: theme.palette.mode === 'dark'
                            ? 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)'
                            : 'linear-gradient(135deg, #ff6b35 0%, #e85a4f 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        }}
                      >
                        📊 Your Complete Wealth Picture
                      </Typography>                      <Typography 
                        variant="h5" 
                        sx={{ 
                          color: theme.palette.text.secondary,
                          fontWeight: 400,
                          lineHeight: 1.6,
                          mb: 2
                        }}
                      >
                        Track ALL your assets in one place! Stocks, crypto, real estate, 
                        savings, and more. Get the complete picture of your financial world. 💰
                      </Typography>
                      
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: theme.palette.text.secondary,
                          fontStyle: 'italic',
                          mb: 4,
                          opacity: 0.8
                        }}
                      >
                        🔥 <strong>Agni</strong> means "fire" in Sanskrit - includes FIRE tracking as one of many features 
                        for your complete portfolio management.
                      </Typography>
                    </Box>                    {/* FIRE Features */}
                    <Paper
                      elevation={3}
                      sx={{
                        p: 3,
                        background: theme.palette.mode === 'dark'
                          ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
                          : 'linear-gradient(135deg, #ffffff 0%, #f7fafc 100%)',
                        border: theme.palette.mode === 'dark'
                          ? '1px solid #475569'
                          : '1px solid #e2e8f0',
                        borderRadius: 3
                      }}
                    >                      <Stack spacing={2}>
                        <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                          🎯 COMPLETE TRACKING FEATURES
                        </Typography>                        <Box sx={{ 
                          display: 'grid', 
                          gridTemplateColumns: 'repeat(2, 1fr)',
                          gap: 2
                        }}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <TrendingUpIcon sx={{ color: '#ff6b35', fontSize: 18 }} />
                            <Typography variant="body2" fontWeight={600}>
                              Stocks & ETFs
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <AccountBalanceIcon sx={{ color: '#3182ce', fontSize: 18 }} />
                            <Typography variant="body2" fontWeight={600}>
                              Cryptocurrency
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <SecurityIcon sx={{ color: '#10b981', fontSize: 18 }} />
                            <Typography variant="body2" fontWeight={600}>
                              Real Estate
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <AnalyticsIcon sx={{ color: '#f7931e', fontSize: 18 }} />
                            <Typography variant="body2" fontWeight={600}>
                              Cash & Savings
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>
                    </Paper>                    {/* CTA Button */}                    <Button
                      onClick={login}
                      variant="contained"
                      size="large"
                      startIcon={<RocketIcon />}
                      sx={{
                        py: 2,
                        px: 4,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        textTransform: 'none',
                        borderRadius: 3,
                        background: theme.palette.mode === 'dark'
                          ? 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)'
                          : 'linear-gradient(135deg, #ff6b35 0%, #e85a4f 100%)',
                        boxShadow: theme.palette.mode === 'dark'
                          ? '0 10px 25px rgba(255, 107, 53, 0.3)'
                          : '0 10px 25px rgba(255, 107, 53, 0.3)',
                        alignSelf: 'flex-start',
                        '&:hover': {
                          background: theme.palette.mode === 'dark'
                            ? 'linear-gradient(135deg, #e85a4f 0%, #d63031 100%)'
                            : 'linear-gradient(135deg, #e85a4f 0%, #d63031 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: theme.palette.mode === 'dark'
                            ? '0 15px 35px rgba(255, 107, 53, 0.4)'
                            : '0 15px 35px rgba(255, 107, 53, 0.4)'
                        }
                      }}
                    >
                      🚀 Start Tracking Everything
                    </Button>

                    {/* Legal Notice */}
                    <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      By signing in, you agree to our{' '}
                      <Link 
                        component="button" 
                        onClick={() => setTermsDialogOpen(true)}
                        sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                      >
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link 
                        component="button" 
                        onClick={() => setPrivacyDialogOpen(true)}
                        sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                      >
                        Privacy Policy
                      </Link>
                    </Typography>
                  </Stack>                </Box>

                {/* Right Column - Stats & Trust */}
                <Box sx={{ flex: 1, width: '100%' }}>                  <Paper
                    elevation={8}
                    sx={{
                      p: 4,
                      borderRadius: 4,
                      background: theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
                        : 'linear-gradient(135deg, #ffffff 0%, #f7fafc 100%)',
                      border: theme.palette.mode === 'dark'
                        ? '1px solid #475569'
                        : '1px solid #e2e8f0'
                    }}
                  >
                    <Stack spacing={4}>
                      <Box textAlign="center">
                        <Avatar
                          sx={{
                            bgcolor: theme.palette.mode === 'dark'
                              ? 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)'
                              : 'linear-gradient(135deg, #ff6b35 0%, #e85a4f 100%)',
                            width: 80,
                            height: 80,
                            mx: 'auto',
                            mb: 2
                          }}
                        >
                          <FireIcon sx={{ fontSize: 40 }} />
                        </Avatar>                        <Typography variant="h5" fontWeight={700} color="text.primary" mb={1}>
                          📊 Complete Portfolio View
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Track all your assets in one unified dashboard - from stocks to crypto to real estate
                        </Typography>
                      </Box>

                      {/* Statistics */}
                      <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 3
                      }}>                        <Box textAlign="center">
                          <Typography variant="h4" fontWeight={800} sx={{ color: '#ff6b35' }}>
                            50+
                          </Typography>
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            ASSET TYPES
                          </Typography>
                        </Box>
                        <Box textAlign="center">
                          <Typography variant="h4" fontWeight={800} sx={{ color: '#10b981' }}>
                            $100M+
                          </Typography>
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            TRACKED ASSETS
                          </Typography>
                        </Box>
                        <Box textAlign="center">
                          <Typography variant="h4" fontWeight={800} sx={{ color: '#f7931e' }}>
                            Real-time
                          </Typography>
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            PRICE UPDATES
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </Paper>
                </Box>
              </Box>
            </Box>
          </Container>          {/* Features Section */}
          <Box
            sx={{
              py: 8,
              background: theme.palette.mode === 'dark'
                ? alpha('#3b82f6', 0.08)
                : alpha('#1a365d', 0.05),
              backdropFilter: 'blur(10px)',
              borderTop: theme.palette.mode === 'dark'
                ? '1px solid #475569'
                : '1px solid #e2e8f0'
            }}
          >
            <Container maxWidth="lg">              <Typography 
                variant="h4" 
                align="center" 
                sx={{ 
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  mb: 6
                }}
              >
                💡 Why Choose Agni Folio for Complete Asset Tracking?
              </Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                gap: 4
              }}>
                {features.map((feature, index) => (
                  <Card
                    key={index}                    sx={{
                        height: '100%',
                        background: theme.palette.mode === 'dark'
                          ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
                          : 'linear-gradient(135deg, #ffffff 0%, #f7fafc 100%)',
                        border: theme.palette.mode === 'dark'
                          ? '1px solid #475569'
                          : '1px solid #e2e8f0',
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: theme.palette.mode === 'dark'
                            ? '0 20px 60px rgba(0, 0, 0, 0.4)'
                            : '0 20px 60px rgba(0, 0, 0, 0.15)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 4, textAlign: 'center' }}>                        <Avatar
                          sx={{
                            bgcolor: theme.palette.mode === 'dark'
                              ? alpha('#3b82f6', 0.15)
                              : alpha('#1a365d', 0.1),
                            color: theme.palette.mode === 'dark'
                              ? '#60a5fa'
                              : '#1a365d',
                            width: 72,
                            height: 72,
                            mx: 'auto',
                            mb: 3
                          }}
                        >
                          {feature.icon}
                        </Avatar>                        <Typography variant="h6" fontWeight={700} mb={2} color="text.primary">
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
                          {feature.description}
                        </Typography></CardContent>
                    </Card>
                ))}
              </Box>
            </Container>
          </Box>          {/* Professional Footer */}
          <Box
            sx={{
              py: 6,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
                : 'linear-gradient(135deg, #1a365d 0%, #2d3748 100%)',
              color: 'white'
            }}
          ><Container maxWidth="lg">              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1.5fr' },
                gap: 4
              }}>                <Box>
                  <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Avatar
                      sx={{
                        bgcolor: '#ff6b35',
                        color: '#ffffff',
                        width: 40,
                        height: 40
                      }}
                    >
                      <FireIcon />
                    </Avatar>
                    <Typography variant="h6" fontWeight={700}>
                      Agni Folio
                    </Typography>
                  </Box>                  <Typography variant="body2" color="inherit" mb={3} sx={{ opacity: 0.8 }}>
                    Your complete portfolio tracking solution. Track all your assets, 
                    get insights, and take control of your financial future! 📊
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <IconButton sx={{ color: 'white', p: 1 }}>
                      <LinkedInIcon />
                    </IconButton>
                    <IconButton sx={{ color: 'white', p: 1 }}>
                      <TwitterIcon />
                    </IconButton>
                    <IconButton sx={{ color: 'white', p: 1 }}>
                      <FacebookIcon />
                    </IconButton>
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    Legal
                  </Typography>
                  <Stack spacing={1}>
                    <Link 
                      component="button" 
                      onClick={() => setPrivacyDialogOpen(true)}
                      sx={{ color: 'white', textAlign: 'left', textDecoration: 'none', opacity: 0.8 }}
                    >
                      Privacy Policy
                    </Link>
                    <Link 
                      component="button" 
                      onClick={() => setTermsDialogOpen(true)}
                      sx={{ color: 'white', textAlign: 'left', textDecoration: 'none', opacity: 0.8 }}
                    >
                      Terms of Service
                    </Link>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Cookie Policy
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      GDPR Compliance
                    </Typography>
                  </Stack>                </Box>

                <Box>
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    Contact
                  </Typography>
                  <Stack spacing={1}>                    <Box display="flex" alignItems="center" gap={1}>
                      <EmailIcon sx={{ fontSize: 16 }} />
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        support@agnifolio.com
                      </Typography>
                    </Box>                    <Box display="flex" alignItems="center" gap={1}>
                      <PhoneIcon sx={{ fontSize: 16 }} />
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        24/7 Support Available
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Box>

              <Divider sx={{ my: 4, borderColor: alpha('#ffffff', 0.2) }} />              <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  © 2025 Agni Folio. All rights reserved.
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.6 }}>
                  Secure Portfolio Tracking Platform | Your Financial Data, Your Control
                </Typography>
              </Box>
            </Container>
          </Box>
        </Box>        {/* Combined GDPR & Cookie Consent Bottom Bar */}
        {(gdprDialogOpen || cookieDialogOpen) && (
          <Paper
            elevation={8}            sx={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1300,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
                : 'linear-gradient(135deg, #1a365d 0%, #2c5282 100%)',
              color: 'white',
              borderRadius: '16px 16px 0 0',
              animation: 'slideUp 0.3s ease-out',
              '@keyframes slideUp': {
                '0%': {
                  transform: 'translateY(100%)',
                  opacity: 0
                },
                '100%': {
                  transform: 'translateY(0)',
                  opacity: 1
                }
              }
            }}
          >
            <Container maxWidth="lg">
              <Box sx={{ p: { xs: 3, md: 4 } }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: { xs: 'flex-start', md: 'center' },
                  gap: 4
                }}>
                  <Box sx={{ flex: 1 }}>                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <PolicyIcon sx={{ 
                          color: theme.palette.mode === 'dark' ? '#60a5fa' : '#60a5fa', 
                          fontSize: 28 
                        }} />
                        <ShieldIcon sx={{ 
                          color: theme.palette.mode === 'dark' ? '#34d399' : '#10b981', 
                          fontSize: 28 
                        }} />
                      </Box>
                      <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1.1rem', md: '1.3rem' } }}>
                        Privacy & Cookie Consent
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" sx={{ opacity: 0.95, lineHeight: 1.6, mb: 2 }}>
                      <strong>Privacy:</strong> We respect your privacy and need your consent to process your data for authentication, 
                      portfolio management, and service improvements under GDPR regulations.
                    </Typography>
                    
                    <Typography variant="body2" sx={{ opacity: 0.95, lineHeight: 1.6 }}>
                      <strong>Cookies:</strong> We use essential cookies for authentication, security, and platform functionality. 
                      These are required for our service to work properly.
                    </Typography>
                    
                    <Typography variant="caption" sx={{ opacity: 0.8, mt: 2, display: 'block', fontStyle: 'italic' }}>
                      You can withdraw consent anytime or learn more about our privacy practices.
                    </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    display: 'flex',
                    flexDirection: { xs: 'row', md: 'column' },
                    gap: 2,
                    width: { xs: '100%', md: 'auto' },
                    minWidth: { md: '200px' }
                  }}>
                    <Button
                      onClick={() => setPrivacyDialogOpen(true)}
                      variant="outlined"
                      size="medium"
                      startIcon={<PolicyIcon />}
                      sx={{
                        color: 'white',
                        borderColor: alpha('#ffffff', 0.4),
                        textTransform: 'none',
                        flex: { xs: 1, md: 'none' },
                        fontWeight: 500,
                        '&:hover': {
                          borderColor: 'white',
                          bgcolor: alpha('#ffffff', 0.1)
                        }
                      }}
                    >
                      Learn More
                    </Button>
                    <Button
                      onClick={() => {
                        handleGdprAccept();
                        handleCookieAccept();
                      }}
                      variant="contained"
                      size="large"
                      startIcon={<VerifiedIcon />}                      sx={{
                        bgcolor: theme.palette.mode === 'dark' ? '#059669' : '#10b981',
                        color: 'white',
                        fontWeight: 700,
                        textTransform: 'none',
                        flex: { xs: 2, md: 'none' },
                        py: { xs: 1.5, md: 1.5 },
                        fontSize: { xs: '1rem', md: '1.1rem' },
                        boxShadow: theme.palette.mode === 'dark'
                          ? '0 4px 15px rgba(5, 150, 105, 0.3)'
                          : '0 4px 15px rgba(16, 185, 129, 0.3)',
                        '&:hover': {
                          bgcolor: theme.palette.mode === 'dark' ? '#047857' : '#059669',
                          transform: 'translateY(-1px)',
                          boxShadow: theme.palette.mode === 'dark'
                            ? '0 6px 20px rgba(5, 150, 105, 0.4)'
                            : '0 6px 20px rgba(16, 185, 129, 0.4)'
                        }
                      }}
                    >
                      Accept All & Continue
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Container>
          </Paper>
        )}

        {/* Privacy Policy Dialog */}
        <Dialog
          open={privacyDialogOpen}
          onClose={() => setPrivacyDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={2}>
              <PolicyIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Privacy Policy
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={3}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={600}>Data Collection</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2">
                    We collect only the minimum data necessary to provide our portfolio management services, 
                    including your Google account information and portfolio data you choose to track.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={600}>Data Usage</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2">
                    Your data is used exclusively to provide our portfolio tracking and analysis services. 
                    We never sell or share your data with third parties for marketing purposes.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={600}>Data Security</Typography>
                </AccordionSummary>                <AccordionDetails>
                  <Typography variant="body2">
                    We employ industry-standard security measures including 256-bit encryption, 
                    secure data centers, and regular security audits to protect your information.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={600}>Your Rights</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2">
                    You have the right to access, modify, or delete your data at any time. 
                    Contact our support team to exercise these rights or for any privacy concerns.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setPrivacyDialogOpen(false)} variant="outlined">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Terms of Service Dialog */}
        <Dialog
          open={termsDialogOpen}
          onClose={() => setTermsDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={2}>
              <GavelIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Terms of Service
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={3}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={600}>Service Description</Typography>
                </AccordionSummary>                <AccordionDetails>
                  <Typography variant="body2">
                    Agni Folio provides portfolio tracking and analysis tools for personal investment management. 
                    Our platform is for informational purposes and does not constitute financial advice.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={600}>User Responsibilities</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2">
                    Users are responsible for the accuracy of their portfolio data and should not share 
                    their account credentials. All investment decisions remain the user's responsibility.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={600}>Limitation of Liability</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2">
                    Our service is provided "as is" without warranties. We are not liable for investment 
                    decisions made based on our platform or any financial losses incurred.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={600}>Service Availability</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2">
                    We strive for 99.9% uptime but cannot guarantee uninterrupted service. 
                    Maintenance windows will be announced in advance when possible.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setTermsDialogOpen(false)} variant="outlined">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  // Should ideally not be reached if useEffect works correctly
  return null;
};

export default LandingPage;
