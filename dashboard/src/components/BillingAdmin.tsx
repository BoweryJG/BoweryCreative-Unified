import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  TextField,
  Stack,
  Grid,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Receipt as ReceiptIcon } from '@mui/icons-material';
import { supabase } from '../lib/supabase';

interface Customer {
  id: string;
  email: string;
  full_name: string;
  company_name?: string;
  monthly_billing?: number;
  status: 'active' | 'inactive' | 'pending';
}

export const BillingAdmin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    company_name: '',
    monthly_billing: '',
  });

  const handleCreateCustomer = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: Math.random().toString(36).slice(-12),
        options: {
          data: {
            full_name: formData.full_name,
            company_name: formData.company_name,
          },
        },
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Failed to create user account');
      }

      // Create Stripe customer via function
      const { error: stripeError } = await supabase.functions.invoke('admin-create-customer', {
        body: {
          userId: authData.user.id,
          email: formData.email,
          name: formData.full_name,
          metadata: {
            company: formData.company_name,
            monthly_billing: formData.monthly_billing,
            billing_cycle: 'monthly',
          },
        },
      });

      if (stripeError) {
        console.warn('Stripe customer creation failed:', stripeError);
      }

      // Send welcome email
      await supabase.functions.invoke('admin-send-setup-email', {
        body: {
          email: formData.email,
          name: formData.full_name,
          setupLink: `${window.location.origin}/billing-setup`,
        },
      });

      setSuccess(true);
      setFormData({ email: '', full_name: '', company_name: '', monthly_billing: '' });
      loadCustomers(); // Refresh list
      
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      console.error('Error creating customer:', err);
      setError(err.message || 'Failed to create customer');
    } finally {
      setLoading(false);
    }
  };

  const loadCustomers = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select(`
          *,
          customers!left (stripe_customer_id)
        `)
        .not('monthly_billing', 'is', null)
        .order('created_at', { ascending: false });

      const mappedCustomers = data?.map(profile => ({
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name || 'Unnamed Customer',
        company_name: profile.company_name,
        monthly_billing: profile.monthly_billing,
        status: (profile.customers?.[0]?.stripe_customer_id ? 'active' : 'pending') as 'active' | 'inactive' | 'pending',
      })) || [];

      setCustomers(mappedCustomers);
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };

  React.useEffect(() => {
    loadCustomers();
  }, []);

  const handleSendInvoice = async (customer: Customer) => {
    try {
      await supabase.functions.invoke('admin-create-invoice', {
        body: {
          customer_id: customer.id,
          customer_email: customer.email,
          customer_name: customer.full_name,
          line_items: [{
            id: '1',
            description: `Monthly Service - ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
            quantity: 1,
            unit_price: customer.monthly_billing || 0,
            amount: customer.monthly_billing || 0,
          }],
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          payment_terms: 'net30',
          notes: '',
          send_email: true,
        },
      });

      alert('Invoice sent successfully!');
    } catch (error) {
      console.error('Error sending invoice:', error);
      alert('Failed to send invoice');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Billing Administration
      </Typography>
      
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Create New Customer
              </Typography>
              
              {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}
              
              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Customer created successfully! Welcome email sent.
                </Alert>
              )}
              
              <Stack spacing={2}>
                <TextField
                  label="Full Name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Dr. Greg Pedro"
                  required
                />
                
                <TextField
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="greg@example.com"
                  required
                />
                
                <TextField
                  label="Company Name"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  placeholder="Pedro Medical Practice"
                />
                
                <TextField
                  label="Monthly Billing Amount ($)"
                  type="number"
                  value={formData.monthly_billing}
                  onChange={(e) => setFormData({ ...formData, monthly_billing: e.target.value })}
                  placeholder="2000"
                />
                
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateCustomer}
                  disabled={loading || !formData.email || !formData.full_name}
                >
                  {loading ? 'Creating...' : 'Create Customer'}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Billing Customers ({customers.length})
              </Typography>
              
              <Stack spacing={2}>
                {customers.map((customer) => (
                  <Box key={customer.id} sx={{ p: 2, border: 1, borderColor: 'grey.300', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {customer.full_name}
                      </Typography>
                      <Chip 
                        size="small" 
                        label={customer.status} 
                        color={customer.status === 'active' ? 'success' : 'default'} 
                      />
                    </Box>
                    
                    <Typography variant="body2" color="textSecondary">
                      {customer.email}
                      {customer.company_name && ` • ${customer.company_name}`}
                    </Typography>
                    
                    {customer.monthly_billing && (
                      <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                        ${customer.monthly_billing}/month
                      </Typography>
                    )}
                    
                    <Button
                      size="small"
                      startIcon={<ReceiptIcon />}
                      onClick={() => handleSendInvoice(customer)}
                      sx={{ mt: 1 }}
                      disabled={customer.status !== 'active'}
                    >
                      Send Invoice
                    </Button>
                  </Box>
                ))}
                
                {customers.length === 0 && (
                  <Typography variant="body2" color="textSecondary" textAlign="center" sx={{ py: 2 }}>
                    No billing customers yet. Create one above to get started.
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};