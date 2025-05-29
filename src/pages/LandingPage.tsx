import React, { useEffect } from 'react';
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
  Chip
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingUpIcon,
  Analytics as AnalyticsIcon,
  Shield as ShieldIcon,
  Verified as VerifiedIcon,
  Google as GoogleIcon
} from '@mui/icons-material';
import { useAuth } from '../components/Layout';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const { login, isAuthenticated, authLoading } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate('/portfolio');
    }
  }, [isAuthenticated, authLoading, navigate]);

  if (authLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="100vh"
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
        }}
      >
        <Typography variant="h6" color="white">Loading...</Typography>
      </Box>
    );
  }

  const features = [
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Bank-Level Security',
      description: 'Your data is protected with enterprise-grade encryption and security protocols.'
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      title: 'Real-Time Tracking',
      description: 'Monitor your portfolio performance across multiple currencies and markets.'
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
      title: 'Advanced Analytics',
      description: 'Comprehensive charts and insights to make informed investment decisions.'
    }
  ];

  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            py: 2,
            px: 4,
            background: alpha(theme.palette.common.white, 0.1),
            backdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.2)}`
          }}
        >
          <Container maxWidth="lg">
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                sx={{
                  bgcolor: alpha(theme.palette.common.white, 0.2),
                  color: theme.palette.common.white,
                  width: 48,
                  height: 48
                }}
              >
                <AccountBalanceIcon />
              </Avatar>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700,
                  color: theme.palette.common.white,
                  letterSpacing: '-0.01em'
                }}              >
                Flamefolio
              </Typography>
              <Chip
                icon={<VerifiedIcon />}
                label="Professional"
                size="small"
                sx={{
                  bgcolor: alpha(theme.palette.success.main, 0.2),
                  color: theme.palette.common.white,
                  fontWeight: 600,
                  ml: 1
                }}
              />
            </Box>
          </Container>
        </Box>        {/* Hero Section */}
        <Container maxWidth="lg" sx={{ flex: 1, display: 'flex', alignItems: 'center', py: 8 }}>
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 6,
              alignItems: 'center',
              width: '100%'
            }}
          >
            <Box>
              <Stack spacing={4}>
                <Box>
                  <Typography 
                    variant={isMobile ? "h3" : "h2"} 
                    sx={{ 
                      fontWeight: 800,
                      color: theme.palette.common.white,
                      mb: 2,
                      lineHeight: 1.2
                    }}
                  >
                    Professional Portfolio Management
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: alpha(theme.palette.common.white, 0.9),
                      fontWeight: 400,
                      lineHeight: 1.6
                    }}
                  >
                    Take control of your investments with our banking-grade portfolio tracking platform. 
                    Secure, intuitive, and designed for serious investors.
                  </Typography>
                </Box>

                <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                  <Box display="flex" alignItems="center" gap={1}>
                    <ShieldIcon sx={{ color: theme.palette.success.light, fontSize: 20 }} />
                    <Typography variant="body2" color="white" fontWeight={600}>
                      Bank-Grade Security
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <VerifiedIcon sx={{ color: theme.palette.success.light, fontSize: 20 }} />
                    <Typography variant="body2" color="white" fontWeight={600}>
                      Real-Time Data
                    </Typography>
                  </Box>
                </Stack>

                <Button
                  onClick={login}
                  variant="contained"
                  size="large"
                  startIcon={<GoogleIcon />}
                  sx={{
                    py: 2,
                    px: 4,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    color: theme.palette.primary.main,
                    border: `2px solid ${alpha(theme.palette.common.white, 0.3)}`,
                    boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.3)}`,
                    alignSelf: 'flex-start',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #f8fafc 0%, #e5e7eb 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: `0 12px 40px ${alpha(theme.palette.common.black, 0.4)}`
                    }
                  }}
                >
                  Sign in with Google
                </Button>
              </Stack>
            </Box>

            <Box>
              <Paper
                elevation={24}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  background: alpha(theme.palette.common.white, 0.95),
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${alpha(theme.palette.common.white, 0.3)}`
                }}
              >
                <Stack spacing={3}>
                  <Box textAlign="center">
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        width: 64,
                        height: 64,
                        mx: 'auto',
                        mb: 2
                      }}
                    >
                      <AccountBalanceIcon sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Typography variant="h5" fontWeight={700} color="text.primary" mb={1}>
                      Trusted by Professionals
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Join thousands of investors managing their portfolios with confidence
                    </Typography>
                  </Box>

                  <Box sx={{ textAlign: 'center' }}>
                    <Box 
                      sx={{ 
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: 2
                      }}
                    >
                      <Box>
                        <Typography variant="h4" fontWeight={800} color="primary.main">
                          99.9%
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Uptime
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="h4" fontWeight={800} color="success.main">
                          10K+
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Users
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="h4" fontWeight={800} color="secondary.main">
                          24/7
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Support
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Stack>
              </Paper>
            </Box>
          </Box>
        </Container>

        {/* Features Section */}
        <Box
          sx={{
            py: 8,
            background: alpha(theme.palette.common.white, 0.05),
            backdropFilter: 'blur(10px)',
            borderTop: `1px solid ${alpha(theme.palette.common.white, 0.1)}`
          }}
        >
          <Container maxWidth="lg">
            <Typography 
              variant="h4" 
              align="center" 
              sx={{ 
                fontWeight: 700,
                color: theme.palette.common.white,
                mb: 6
              }}
            >
              Why Choose Our Platform?
            </Typography>
              <Box 
              sx={{ 
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
                gap: 4
              }}
            >
              {features.map((feature, index) => (
                <Card
                  key={index}
                  sx={{
                    height: '100%',
                    background: alpha(theme.palette.common.white, 0.95),
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 20px 60px ${alpha(theme.palette.common.black, 0.3)}`
                    }
                  }}
                >                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                      <Avatar
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                          width: 72,
                          height: 72,
                          mx: 'auto',
                          mb: 3
                        }}
                      >
                        {feature.icon}
                      </Avatar>
                      <Typography variant="h6" fontWeight={700} mb={2}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
              ))}
            </Box>
          </Container>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            py: 4,
            background: alpha(theme.palette.common.black, 0.2),
            backdropFilter: 'blur(10px)',
            borderTop: `1px solid ${alpha(theme.palette.common.white, 0.1)}`
          }}
        >
          <Container maxWidth="lg">
            <Typography 
              variant="body2" 
              align="center" 
              sx={{ 
                color: alpha(theme.palette.common.white, 0.7),
                fontWeight: 500
              }}            >
              © 2024 Flamefolio. Professional Investment Management Platform.
            </Typography>
          </Container>
        </Box>
      </Box>
    );
  }

  // Should ideally not be reached if useEffect works correctly
  return null;
};

export default LandingPage;
