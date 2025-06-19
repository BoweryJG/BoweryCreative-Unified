import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../../contexts/AuthContextPayments';
import { colors } from '../../theme/theme';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    // Handle the OAuth callback
    const handleCallback = async () => {
      // Give Supabase a moment to process the auth
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user is authenticated and redirect accordingly
      if (user) {
        if (isAdmin) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        // If no user after waiting, redirect to login
        navigate('/admin-login');
      }
    };

    handleCallback();
  }, [user, isAdmin, navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.obsidian,
      }}
    >
      <CircularProgress sx={{ color: colors.champagne, mb: 2 }} />
      <Typography sx={{ color: colors.arctic }}>
        Authenticating...
      </Typography>
    </Box>
  );
};