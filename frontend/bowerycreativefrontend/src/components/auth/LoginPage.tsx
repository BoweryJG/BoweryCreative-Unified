import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Paper,
  Alert,
} from '@mui/material';
import { Login } from '@mui/icons-material';
import { colors } from '../../theme/theme';
import GlobalAuthModal from './GlobalAuthModal';
import { useAuthModal } from '../../hooks/useAuthModal';
import audioManager from '../../utils/audioManager';

export const LoginPage: React.FC = () => {
  const { isAuthModalOpen, openAuthModal, closeAuthModal, handleAuthSuccess } = useAuthModal();

  const handleLoginClick = async () => {
    // Play click sound with a luxurious frequency
    await audioManager.playClickSound();
    openAuthModal();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        background: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        px: { xs: 2, sm: 3 },
        py: { xs: 3, sm: 4 },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${colors.champagne}, transparent)`,
        },
      }}
    >
      {/* Cosmic orbs */}
      <div className="login-cosmic-orb login-cosmic-orb-1" />
      <div className="login-cosmic-orb login-cosmic-orb-2" />
      <Container maxWidth="sm" sx={{ width: '100%', maxWidth: { xs: '100%', sm: '480px' } }}>
        <Card
          elevation={0}
          sx={{
            background: colors.carbon,
            border: `1px solid ${colors.graphite}`,
            borderRadius: 3,
            overflow: 'visible', // Changed to visible to prevent clipping
            position: 'relative',
            mt: { xs: 6, sm: 8 }, // Add margin to accommodate atom animation
          }}
        >
          {/* Header */}
          <Paper
            sx={{
              background: `linear-gradient(135deg, ${colors.carbon} 0%, ${colors.graphite} 100%)`,
              p: { xs: 3, sm: 4 },
              pt: { xs: 8, sm: 10 }, // Extra padding to accommodate atom animation
              textAlign: 'center',
              borderBottom: `1px solid ${colors.graphite}`,
              position: 'relative',
              overflow: 'visible',
              minHeight: { xs: '280px', sm: '320px' }, // Ensure minimum height
            }}
          >
            {/* Atomic animation */}
            <div className="cosmic-atom">
              <div className="cosmic-nucleus"></div>
              <div className="cosmic-electron-orbit cosmic-orbit-1">
                <div className="cosmic-electron cosmic-electron-1"></div>
              </div>
              <div className="cosmic-electron-orbit cosmic-orbit-2">
                <div className="cosmic-electron cosmic-electron-2"></div>
              </div>
              <div className="cosmic-electron-orbit cosmic-orbit-3">
                <div className="cosmic-electron cosmic-electron-3"></div>
              </div>
            </div>
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  width: { xs: 56, sm: 64 },
                  height: { xs: 56, sm: 64 },
                  border: `2px solid ${colors.champagne}`,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                  background: `linear-gradient(135deg, ${colors.champagne}20, transparent)`,
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    color: colors.champagne,
                    fontWeight: 600,
                    fontFamily: '"Inter", sans-serif',
                    fontSize: { xs: '2rem', sm: '2.5rem' },
                  }}
                >
                  B
                </Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{
                  color: colors.arctic,
                  fontWeight: 600,
                  mb: 1,
                  fontFamily: '"Inter", sans-serif',
                  letterSpacing: '0.02em',
                  fontSize: { xs: '1.75rem', sm: '2.125rem' },
                }}
              >
                BOWERY
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: colors.champagne,
                  fontWeight: 300,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                }}
              >
                Payment Portal
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{
                color: colors.racingSilver,
                lineHeight: 1.6,
                mb: 2,
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            >
              Access your subscription management, payment history, and campaign credits
            </Typography>
            
            <Alert 
              severity="info" 
              sx={{ 
                backgroundColor: `${colors.champagne}20`,
                border: `1px solid ${colors.champagne}40`,
                color: colors.arctic,
                '& .MuiAlert-icon': {
                  color: colors.champagne
                }
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Restricted Access Portal
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.9 }}>
                Access limited to authorized Bowery Creative accounts only
              </Typography>
            </Alert>
          </Paper>

          {/* Login Form */}
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Typography
              variant="h6"
              sx={{
                color: colors.arctic,
                mb: 3,
                textAlign: 'center',
                fontWeight: 500,
              }}
            >
              Sign in to your account
            </Typography>

            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<Login />}
              onClick={handleLoginClick}
              onMouseEnter={() => audioManager.playHoverSound(440)} // A4 note for hover
              sx={{
                py: 1.5,
                background: colors.champagne,
                color: colors.obsidian,
                fontWeight: 600,
                fontSize: '1.1rem',
                '&:hover': {
                  background: '#e4c547',
                  transform: 'translateY(-1px)',
                  boxShadow: `0 8px 25px ${colors.champagne}40`,
                },
                transition: 'all 0.3s ease',
              }}
            >
              Access Payment Portal
            </Button>

            <Typography
              variant="body2"
              sx={{
                color: colors.racingSilver,
                textAlign: 'center',
                mt: 4,
                lineHeight: 1.6,
              }}
            >
              By signing in, you agree to our{' '}
              <Box component="span" sx={{ color: colors.champagne, cursor: 'pointer' }}>
                Terms of Service
              </Box>{' '}
              and{' '}
              <Box component="span" sx={{ color: colors.champagne, cursor: 'pointer' }}>
                Privacy Policy
              </Box>
            </Typography>
          </CardContent>
        </Card>

        {/* Footer */}
        <Typography
          variant="body2"
          sx={{
            color: colors.racingSilver,
            textAlign: 'center',
            mt: 3,
          }}
        >
          © 2025 Bowery Creative. Engineering Intelligence.
        </Typography>
      </Container>

      {/* Auth Modal */}
      <GlobalAuthModal 
        open={isAuthModalOpen} 
        onClose={closeAuthModal} 
        onSuccess={handleAuthSuccess}
      />
    </Box>
  );
};