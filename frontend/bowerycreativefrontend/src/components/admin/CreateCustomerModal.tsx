import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
} from '@mui/material';
import { supabase } from '../../lib/supabase';

interface CreateCustomerModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateCustomerModal: React.FC<CreateCustomerModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    company_name: '',
    monthly_billing: '',
    billing_cycle: 'monthly' as 'monthly' | 'annual' | 'custom',
    send_welcome_email: true,
    create_stripe_customer: true,
    api_usage_tracked: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // First, create the user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: Math.random().toString(36).slice(-12), // Generate random password
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

      // Update the profile with billing information
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          company_name: formData.company_name,
          monthly_billing: formData.monthly_billing ? parseFloat(formData.monthly_billing) : null,
          billing_cycle: formData.billing_cycle,
          api_usage_tracked: formData.api_usage_tracked,
        })
        .eq('id', authData.user.id);

      if (profileError) throw profileError;

      // Create Stripe customer if requested
      if (formData.create_stripe_customer) {
        const { error } = await supabase.functions.invoke('admin-create-customer', {
          body: {
            userId: authData.user.id,
            email: formData.email,
            name: formData.full_name,
            metadata: {
              company: formData.company_name,
              monthly_billing: formData.monthly_billing,
              billing_cycle: formData.billing_cycle,
            },
          },
        });

        if (error) {
          throw new Error(error.message || 'Failed to create Stripe customer');
        }
      }

      // Send welcome email with billing setup link
      if (formData.send_welcome_email) {
        const { error } = await supabase.functions.invoke('admin-send-setup-email', {
          body: {
            email: formData.email,
            name: formData.full_name,
            setupLink: `${window.location.origin}/setup?token=${authData.user.id}`,
          },
        });

        if (error) {
          console.error('Failed to send welcome email');
        }
      }

      onSuccess();
    } catch (err: any) {
      console.error('Error creating customer:', err);
      setError(err.message || 'Failed to create customer');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSelectChange = (field: string) => (
    event: any
  ) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSwitchChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [field]: event.target.checked,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Create New Customer</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.full_name}
                  onChange={handleChange('full_name')}
                  required
                  placeholder="Dr. Greg Pedro"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  required
                  placeholder="greg@example.com"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Company Name"
                  value={formData.company_name}
                  onChange={handleChange('company_name')}
                  placeholder="Pedro Medical Practice"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Monthly Billing Amount"
                  type="number"
                  value={formData.monthly_billing}
                  onChange={handleChange('monthly_billing')}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  placeholder="2000"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Billing Cycle</InputLabel>
                  <Select
                    value={formData.billing_cycle}
                    onChange={handleSelectChange('billing_cycle')}
                    label="Billing Cycle"
                  >
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="annual">Annual</MenuItem>
                    <MenuItem value="custom">Custom</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.api_usage_tracked}
                      onChange={handleSwitchChange('api_usage_tracked')}
                    />
                  }
                  label="Track API Usage"
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.create_stripe_customer}
                      onChange={handleSwitchChange('create_stripe_customer')}
                    />
                  }
                  label="Create Stripe Customer"
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.send_welcome_email}
                      onChange={handleSwitchChange('send_welcome_email')}
                    />
                  }
                  label="Send Welcome Email with Billing Setup Link"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !formData.email || !formData.full_name}
            startIcon={loading && <CircularProgress size={20} />}
          >
            Create Customer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};