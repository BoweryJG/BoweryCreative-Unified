import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
} from '@mui/material';
import { CheckCircle, Dashboard } from '@mui/icons-material';

export const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const invoiceId = searchParams.get('invoice');

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
          <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 3 }} />
          
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Payment Successful!
          </Typography>
          
          <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
            Thank you for your payment. Your invoice has been marked as paid.
            {invoiceId && ` Invoice ID: ${invoiceId}`}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              startIcon={<Dashboard />}
              onClick={() => navigate('/dashboard')}
              sx={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
                }
              }}
            >
              Go to Dashboard
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};