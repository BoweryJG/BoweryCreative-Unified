import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Grid,
  Typography,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  FormControlLabel,
  Switch,
  InputAdornment,
} from '@mui/material';
import {
  Close as CloseIcon,
  Receipt as ReceiptIcon,
  Link as LinkIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';

interface Customer {
  id: string;
  email: string;
  full_name: string;
  company_name?: string;
  stripe_customer_id?: string;
  monthly_billing?: number;
  billing_cycle?: string;
  status: string;
  api_usage_tracked?: boolean;
}

interface CustomerDetailsModalProps {
  open: boolean;
  customer: Customer;
  onClose: () => void;
  onUpdate: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`customer-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({
  open,
  customer,
  onClose,
  onUpdate,
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState(customer);
  const [payments, setPayments] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [portalUrl, setPortalUrl] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      loadCustomerData();
    }
  }, [open, customer.id]);

  const loadCustomerData = async () => {
    setLoading(true);
    try {
      // Load payments
      const { data: paymentsData } = await supabase
        .from('payments')
        .select('*')
        .eq('customer_id', customer.id)
        .order('created_at', { ascending: false });
      
      setPayments(paymentsData || []);

      // Load invoices
      const { data: invoicesData } = await supabase
        .from('invoices')
        .select('*')
        .eq('customer_id', customer.id)
        .order('created_at', { ascending: false });
      
      setInvoices(invoicesData || []);
    } catch (err) {
      console.error('Error loading customer data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    setError(null);
    
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: editedCustomer.full_name,
          company_name: editedCustomer.company_name,
          monthly_billing: editedCustomer.monthly_billing,
          billing_cycle: editedCustomer.billing_cycle,
          api_usage_tracked: editedCustomer.api_usage_tracked,
        })
        .eq('id', customer.id);

      if (updateError) throw updateError;

      setSuccess(true);
      onUpdate();
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update customer');
    } finally {
      setSaving(false);
    }
  };

  const generatePortalLink = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-create-portal-session', {
        body: {
          customerId: customer.stripe_customer_id,
          returnUrl: window.location.href,
        },
      });

      if (error) throw new Error('Failed to generate portal link');

      setPortalUrl(data.url);
    } catch (err) {
      setError('Failed to generate customer portal link');
    } finally {
      setLoading(false);
    }
  };

  const copyPortalLink = () => {
    if (portalUrl) {
      navigator.clipboard.writeText(portalUrl);
    }
  };

  const getPaymentStatusChip = (status: string) => {
    const statusConfig = {
      succeeded: { color: 'success' as const, label: 'Paid' },
      pending: { color: 'warning' as const, label: 'Pending' },
      failed: { color: 'error' as const, label: 'Failed' },
      refunded: { color: 'default' as const, label: 'Refunded' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Chip size="small" color={config.color} label={config.label} />;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Customer Details</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Customer updated successfully!
          </Alert>
        )}
        
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
          <Tab label="Details" />
          <Tab label="Payments" />
          <Tab label="Invoices" />
          <Tab label="Portal" />
        </Tabs>
        
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={editedCustomer.full_name}
                onChange={(e) => setEditedCustomer({ ...editedCustomer, full_name: e.target.value })}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                value={editedCustomer.email}
                disabled
                helperText="Email cannot be changed"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Name"
                value={editedCustomer.company_name || ''}
                onChange={(e) => setEditedCustomer({ ...editedCustomer, company_name: e.target.value })}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Monthly Billing"
                type="number"
                value={editedCustomer.monthly_billing || ''}
                onChange={(e) => setEditedCustomer({ 
                  ...editedCustomer, 
                  monthly_billing: parseFloat(e.target.value) || undefined 
                })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Billing Cycle"
                value={editedCustomer.billing_cycle || 'monthly'}
                onChange={(e) => setEditedCustomer({ ...editedCustomer, billing_cycle: e.target.value })}
                select
                SelectProps={{ native: true }}
              >
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
                <option value="custom">Custom</option>
              </TextField>
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editedCustomer.api_usage_tracked || false}
                    onChange={(e) => setEditedCustomer({ 
                      ...editedCustomer, 
                      api_usage_tracked: e.target.checked 
                    })}
                  />
                }
                label="Track API Usage"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleSaveChanges}
                  disabled={saving}
                  startIcon={saving && <CircularProgress size={20} />}
                >
                  Save Changes
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          {loading ? (
            <CircularProgress />
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No payments found
                      </TableCell>
                    </TableRow>
                  ) : (
                    payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          {format(new Date(payment.created_at), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>${(payment.amount / 100).toFixed(2)}</TableCell>
                        <TableCell>{getPaymentStatusChip(payment.status)}</TableCell>
                        <TableCell>{payment.description || '-'}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          {loading ? (
            <CircularProgress />
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Invoice #</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No invoices found
                      </TableCell>
                    </TableRow>
                  ) : (
                    invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>{invoice.invoice_number}</TableCell>
                        <TableCell>
                          {format(new Date(invoice.created_at), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>${invoice.amount_due.toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip 
                            size="small" 
                            label={invoice.status} 
                            color={invoice.status === 'paid' ? 'success' : 'default'} 
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton size="small">
                            <ReceiptIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <Box>
            <Typography variant="body1" gutterBottom>
              Generate a secure portal link for the customer to manage their billing
            </Typography>
            
            {customer.stripe_customer_id ? (
              <Box sx={{ mt: 3 }}>
                {portalUrl ? (
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Customer Portal URL:
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TextField
                        fullWidth
                        value={portalUrl}
                        size="small"
                        InputProps={{
                          readOnly: true,
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={copyPortalLink} size="small">
                                <CopyIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                      This link expires in 24 hours
                    </Typography>
                  </Paper>
                ) : (
                  <Button
                    variant="contained"
                    startIcon={<LinkIcon />}
                    onClick={generatePortalLink}
                    disabled={loading}
                  >
                    Generate Portal Link
                  </Button>
                )}
              </Box>
            ) : (
              <Alert severity="info" sx={{ mt: 2 }}>
                This customer doesn't have a Stripe account yet. They need to complete their billing setup first.
              </Alert>
            )}
          </Box>
        </TabPanel>
      </DialogContent>
    </Dialog>
  );
};