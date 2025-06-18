import React from 'react';
import { Box, CircularProgress, Typography, Alert, Container, Paper } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { LoginPage } from './LoginPage';
import { colors } from '../../theme/theme';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, hasAccess } = useAuth();
  const isAllowed = hasAccess;

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${colors.obsidian} 0%, ${colors.carbon} 100%)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
        }}
      >
        <CircularProgress 
          size={60} 
          sx={{ 
            color: colors.champagne,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }} 
        />
        <Typography
          variant="h6"
          sx={{
            color: colors.racingSilver,
            fontWeight: 300,
            letterSpacing: '0.05em',
          }}
        >
          Loading Bowery Portal...
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  // If user is authenticated but not allowed, show access denied
  if (user && !isAllowed) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${colors.obsidian} 0%, ${colors.carbon} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            sx={{
              p: 4,
              textAlign: 'center',
              background: colors.carbon,
              border: `1px solid ${colors.graphite}`,
              borderRadius: 3,
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h4"
                sx={{
                  color: colors.arctic,
                  fontWeight: 600,
                  mb: 1,
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                Access Denied
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: colors.champagne,
                  fontWeight: 300,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontSize: '0.875rem',
                }}
              >
                Unauthorized Account
              </Typography>
            </Box>

            <Alert 
              severity="error" 
              sx={{ 
                backgroundColor: '#ff6b6b20',
                border: '1px solid #ff6b6b40',
                color: colors.arctic,
                mb: 3,
                '& .MuiAlert-icon': {
                  color: '#ff6b6b'
                }
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Your account ({user.email}) is not authorized to access this payment portal.
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                This portal is restricted to authorized Bowery Creative accounts only.
              </Typography>
            </Alert>

            <Typography
              variant="body1"
              sx={{
                color: colors.racingSilver,
                lineHeight: 1.6,
              }}
            >
              If you believe this is an error, please contact your administrator or try signing in with an authorized account.
            </Typography>
          </Paper>
        </Container>
      </Box>
    );
  }

  return <>{children}</>;
};