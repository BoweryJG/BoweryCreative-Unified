import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
} from '@mui/material';
import { Cancel, ArrowBack } from '@mui/icons-material';

export const PaymentCancel: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Container maxWidth="sm">
        <Paper sx={{ 
          p: 4,
          textAlign: 'center',
          background: 'rgba(255,255,255,0.98)',
        }}>
          <Cancel sx={{ fontSize: 80, color: 'error.main', mb: 3 }} />
          
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Payment Canceled
          </Typography>
          
          <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
            Your payment was canceled. No charges were made to your account.
          </Typography>

          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
              }
            }}
          >
            Try Again
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};