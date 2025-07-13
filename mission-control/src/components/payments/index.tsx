import React from 'react';
import { Box, Typography, Alert } from '@mui/material';

interface ClientPaymentSectionProps {
  clientId: string;
}

export const ClientPaymentSection: React.FC<ClientPaymentSectionProps> = ({ clientId }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Payment Management
      </Typography>
      <Alert severity="info">
        Stripe payment integration coming soon for client {clientId}
      </Alert>
      <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
        This section will include:
      </Typography>
      <ul>
        <li>Subscription management</li>
        <li>Campaign credit purchases</li>
        <li>Payment history</li>
        <li>Invoice generation</li>
      </ul>
    </Box>
  );
};