import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
import { createClient } from '@supabase/supabase-js';

// Create a fresh Supabase client for payments to avoid auth conflicts
const paymentSupabase = createClient(
  'https://fiozmyoedptukpkzuhqm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpb3pteW9lZHB0dWtwa3p1aHFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MTUxODcsImV4cCI6MjA2NTM5MTE4N30.XrzLFbtoOKcX0kU5K7MSPQKwTDNm6cFtefUGxSJzm-o'
);

export const PaymentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingInvoice, setLoadingInvoice] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invoiceData, setInvoiceData] = useState<any>(null);

  // Get parameters from URL
  const invoiceId = searchParams.get('invoice') || searchParams.get('id');
  const amount = parseFloat(searchParams.get('amount') || '0');
  const code = searchParams.get('code');
  const email = searchParams.get('email');
  const submissionId = searchParams.get('submissionId');
  const packageName = searchParams.get('package');
  
  // Debug logging
  console.log('Payment page URL params:', {
    invoiceId,
    amount,
    code,
    email,
    fullURL: window.location.href
  });

  // Load invoice data
  useEffect(() => {
    const loadInvoice = async () => {
      setLoadingInvoice(true);
      
      // First check if we have a real invoice ID (UUID format)
      if (invoiceId && invoiceId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        try {
          // Try to load from database
          const { data, error } = await paymentSupabase
            .from('invoices')
            .select('*')
            .eq('id', invoiceId)
            .single();
          
          if (data && !error) {
            setInvoiceData({
              id: data.id,
              client_name: data.client_name,
              amount: parseFloat(data.amount),
              description: 'Custom Payment',
              invoice_number: data.invoice_number,
              payment_link_title: data.payment_link_title || 'Your campaign starts here',
              payment_link_message: data.payment_link_message || `Complete your payment of $${parseFloat(data.amount).toFixed(2)} to begin`
            });
            setLoadingInvoice(false);
            return;
          }
        } catch (err) {
          console.error('Error loading invoice:', err);
        }
      }
      
      // Fall back to test data
      if (invoiceId === 'sarah-test' || code === 'SARAH') {
        setInvoiceData({
          id: 'sarah-invoice-001',
          client_name: 'Sarah Jones',
          amount: 5.00,
          description: 'Test Package - Monthly Subscription',
          invoice_number: 'SARAH-TEST-001',
          payment_link_title: 'Test Campaign Ready',
          payment_link_message: 'Sarah, complete your test payment to activate your campaign'
        });
      } else if (invoiceId === 'test-flow') {
        setInvoiceData({
          id: 'test-pedro-001',
          client_name: 'Dr. Greg Pedro',
          amount: 1.00,
          description: 'Test Invoice - Payment Flow Test',
          invoice_number: 'TEST-FLOW-001',
          payment_link_title: 'Your campaign starts here',
          payment_link_message: 'Complete this test payment to proceed'
        });
      } else if (invoiceId === 'pedro-monthly' || code === 'PEDRO') {
        setInvoiceData({
          id: 'pedro-invoice-001',
          client_name: 'Dr. Greg Pedro',
          amount: 2000.00,
          description: 'Premium AI Infrastructure - Monthly Marketing Services',
          invoice_number: 'INV-2024-001',
          payment_link_title: 'Your Professional Campaign Awaits',
          payment_link_message: 'Dr. Pedro, your medical practice transformation starts with this payment'
        });
      } else if (amount > 0) {
        setInvoiceData({
          id: 'custom-payment',
          client_name: email || 'Customer',
          amount: amount,
          description: packageName || 'Custom Payment',
          invoice_number: 'CUSTOM-001',
          payment_link_title: 'Your campaign starts here',
          payment_link_message: `Complete your payment of $${amount.toFixed(2)} to begin`
        });
      }
      
      setLoadingInvoice(false);
    };
    
    loadInvoice();
  }, [invoiceId, amount, code, email, packageName]);

  // Removed auto-trigger - user must click button to proceed to checkout

  const handleCreateCheckout = async () => {
    console.log('Button clicked!'); // Debug log
    
    if (!invoiceData) {
      setError('No invoice data found');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Starting checkout with data:', {
        amount: invoiceData.amount,
        description: invoiceData.description,
        invoice_number: invoiceData.invoice_number
      });

      // Create checkout session via Supabase Edge Function
      console.log('About to call supabase.functions.invoke...');
      console.log('Starting Stripe checkout creation...');
      
      let data, error;
      try {
        const requestBody = {
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
          success_url: `${window.location.origin}/payment-success?invoice=${invoiceData.id}${submissionId ? `&submissionId=${submissionId}` : ''}`,
          cancel_url: `${window.location.origin}/payment-cancel?invoice=${invoiceData.id}`,
          metadata: {
            invoice_id: invoiceData.id,
            invoice_number: invoiceData.invoice_number,
            client_name: invoiceData.client_name,
            submission_id: submissionId || null,
            email: email || null,
          }
        };
        
        console.log('Request body:', requestBody);
        
        const result = await paymentSupabase.functions.invoke('create-checkout-session', {
          body: requestBody
        });
        
        console.log('Function result:', result);
        data = result.data;
        error = result.error;
      } catch (err) {
        console.error('Caught error calling supabase function:', err);
        error = err;
      }

      console.log('Supabase function response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No response data from checkout function');
      }

      if (data.error) {
        console.error('Function returned error:', data.error);
        throw new Error(data.error);
      }

      if (data?.url) {
        console.log('Redirecting to Stripe checkout:', data.url);
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        console.error('No URL in response. Full response:', data);
        throw new Error('No checkout URL returned from Stripe');
      }
    } catch (err: any) {
      console.error('Error creating checkout session:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        response: err.response
      });
      setError(err.message || 'Failed to create checkout session');
      setLoading(false);
    }
  };

  if (loadingInvoice) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <CircularProgress sx={{ color: '#fbbf24' }} />
      </Box>
    );
  }

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
          p: { xs: 3, sm: 4 },
          background: 'rgba(255,255,255,0.98)',
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          mx: { xs: 1, sm: 0 }
        }}>
          {/* Header with Custom Title */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h5" sx={{ 
              fontWeight: 'bold',
              mb: 2,
              background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent'
            }}>
              {invoiceData.payment_link_title || 'Your campaign starts here'}
            </Typography>
            {invoiceData.payment_link_message && (
              <Typography variant="body1" sx={{ 
                color: 'text.secondary',
                mb: 2,
                px: 2,
                fontStyle: 'italic'
              }}>
                {invoiceData.payment_link_message}
              </Typography>
            )}
            <Typography variant="caption" color="textSecondary">
              Powered by Bowery Creative
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
            onClick={() => {
              console.log('Button onClick fired!');
              handleCreateCheckout();
            }}
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