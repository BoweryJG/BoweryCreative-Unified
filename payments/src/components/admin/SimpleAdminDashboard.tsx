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
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { supabase } from '../../lib/supabase';

export const SimpleAdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          company_name: formData.company_name,
          monthly_billing: formData.monthly_billing ? parseFloat(formData.monthly_billing) : null,
          billing_cycle: 'monthly',
        })
        .eq('id', authData.user.id);

      if (profileError) throw profileError;

      // Create Stripe customer
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

      setSuccess(true);
      setFormData({ email: '', full_name: '', company_name: '', monthly_billing: '' });
      
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      console.error('Error creating customer:', err);
      setError(err.message || 'Failed to create customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      
      <Card sx={{ mb: 3 }}>
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
              Customer created successfully!
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
      
      <Alert severity="info">
        <Typography variant="body2">
          <strong>Next Steps:</strong><br/>
          1. Customer will receive a welcome email with setup link<br/>
          2. They'll set up their payment method<br/>
          3. You can then send invoices through the system
        </Typography>
      </Alert>
    </Box>
  );
};