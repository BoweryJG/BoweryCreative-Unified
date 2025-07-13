import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { CreditCard, ArrowBack } from '@mui/icons-material';
import { supabase } from '../lib/supabasePayments';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51PNwP6RuBqx4KHEuEJxDZGKfn0LJcqg4gfhFnYRgMF0WBSbaLDMLTjrFmY5LoMb0RcPnPqFAGpLM6vslCcfZPApD00FGOJmoWD');

export const PaymentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invoiceData, setInvoiceData] = useState<any>(null);

  // Get parameters from URL
  const invoiceId = searchParams.get('invoice') || searchParams.get('id');
  const amount = parseFloat(searchParams.get('amount') || '0');
  const code = searchParams.get('code');
  const email = searchParams.get('email');
  
  // Debug logging
  console.log('Payment page URL params:', {
    invoiceId,
    amount,
    code,
    email,
    fullURL: window.location.href
  });

  // Map invoice IDs to test data
  useEffect(() => {
    if (invoiceId === 'sarah-test' || code === 'SARAH') {
      setInvoiceData({
        id: 'sarah-invoice-001',
        client_name: 'Sarah Jones',
        amount: 5.00,
        description: 'Test Package - Monthly Subscription',
        invoice_number: 'SARAH-TEST-001'
      });
    } else if (invoiceId === 'test-flow') {
      setInvoiceData({
        id: 'test-pedro-001',
        client_name: 'Dr. Greg Pedro',
        amount: 1.00,
        description: 'Test Invoice - Payment Flow Test',
        invoice_number: 'TEST-FLOW-001'
      });
    } else if (invoiceId === 'pedro-monthly' || code === 'PEDRO') {
      setInvoiceData({
        id: 'pedro-invoice-001',
        client_name: 'Dr. Greg Pedro',
        amount: 2000.00,
        description: 'Premium AI Infrastructure - Monthly Marketing Services',
        invoice_number: 'INV-2024-001'
      });
    } else if (amount > 0) {
      setInvoiceData({
        id: 'custom-payment',
        client_name: email || 'Customer',
        amount: amount,
        description: 'Custom Payment',
        invoice_number: 'CUSTOM-001'
      });
    }
  }, [invoiceId, amount, code, email]);

  const handleCreateCheckout = async () => {
    if (!invoiceData) {
      setError('No invoice data found');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create checkout session via Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          mode: 'payment',
          line_items: [{
            price_data: {
              currency: 'usd',
              product_data: {
                name: invoiceData.description,
                description: `Invoice ${invoiceData.invoice_number}`,
              },
              unit_amount: Math.round(invoiceData.amount * 100), // Convert to cents
            },
            quantity: 1,
          }],
          success_url: `${window.location.origin}/payment-success?invoice=${invoiceData.id}`,
          cancel_url: `${window.location.origin}/payment-cancel?invoice=${invoiceData.id}`,
          metadata: {
            invoice_id: invoiceData.id,
            invoice_number: invoiceData.invoice_number,
            client_name: invoiceData.client_name,
          }
        }
      });

      if (error) throw error;

      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err: any) {
      console.error('Error creating checkout session:', err);
      setError(err.message || 'Failed to create checkout session');
      setLoading(false);
    }
  };

  if (!invoiceData) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Container maxWidth="sm">
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              No Payment Information Found
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Please use a valid payment link
            </Typography>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate('/')}
            >
              Go to Homepage
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
      py: 8
    }}>
      <Container maxWidth="sm">
        <Paper sx={{ 
          p: 4,
          background: 'rgba(255,255,255,0.98)',
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ 
              fontWeight: 'bold',
              mb: 1,
              background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent'
            }}>
              Bowery Creative
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Secure Payment Portal
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Invoice Details */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Invoice Details
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Invoice Number"
                  secondary={invoiceData.invoice_number}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Client"
                  secondary={invoiceData.client_name}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Description"
                  secondary={invoiceData.description}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Amount Due"
                  secondary={`$${invoiceData.amount.toFixed(2)}`}
                  secondaryTypographyProps={{
                    sx: { 
                      fontSize: '1.25rem',
                      fontWeight: 'bold',
                      color: 'primary.main'
                    }
                  }}
                />
              </ListItem>
            </List>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Payment Button */}
          <Button
            variant="contained"
            size="large"
            fullWidth
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CreditCard />}
            onClick={handleCreateCheckout}
            disabled={loading}
            sx={{
              py: 2,
              background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
              },
              '&:disabled': {
                background: 'rgba(0,0,0,0.12)',
              }
            }}
          >
            {loading ? 'Processing...' : `Pay $${invoiceData.amount.toFixed(2)}`}
          </Button>

          {/* Security Notice */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="caption" color="textSecondary">
              Payments are processed securely by Stripe
            </Typography>
          </Box>
        </Paper>

        {/* Back Button */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            variant="text"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
            sx={{ color: 'white' }}
          >
            Back to Homepage
          </Button>
        </Box>
      </Container>
    </Box>
  );
};