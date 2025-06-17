import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../theme/theme';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Handle auth callback
    const handleAuthCallback = async () => {
      // Wait a moment for auth to settle
      setTimeout(() => {
        if (user) {
          // Successfully authenticated, redirect to dashboard
          navigate('/dashboard');
        } else if (!loading) {
          // Auth failed or user not allowed, redirect to home
          navigate('/');
        }
      }, 1500);
    };

    handleAuthCallback();
  }, [user, loading, navigate]);

  return (
    <Box sx={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${colors.obsidian} 0%, ${colors.carbon} 100%)`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 3
    }}>
      <CircularProgress 
        size={60} 
        sx={{ 
          color: colors.champagne,
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          }
        }} 
      />
      <Typography variant="h5" sx={{ color: colors.arctic, fontWeight: 600 }}>
        Completing sign in...
      </Typography>
      <Typography sx={{ color: colors.racingSilver, textAlign: 'center', maxWidth: 400 }}>
        Please wait while we verify your access to the Bowery Payment Portal
      </Typography>
    </Box>
  );
};

export default AuthCallback;