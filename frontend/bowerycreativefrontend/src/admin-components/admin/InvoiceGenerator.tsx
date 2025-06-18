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
  Typography,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  Preview as PreviewIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';

interface Customer {
  id: string;
  email: string;
  full_name: string;
  company_name?: string;
  monthly_billing?: number;
}

interface InvoiceGeneratorProps {
  open: boolean;
  customer: Customer;
  onClose: () => void;
}

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

export const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({
  open,
  customer,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    due_date: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    payment_terms: 'net30',
    notes: '',
  });
  
  const defaultLineItem: LineItem = {
    id: '1',
    description: 'Monthly Service - ' + format(new Date(), 'MMMM yyyy'),
    quantity: 1,
    unit_price: customer.monthly_billing || 0,
    amount: customer.monthly_billing || 0,
  };
  
  const [lineItems, setLineItems] = useState<LineItem[]>([defaultLineItem]);
  const [newItem, setNewItem] = useState({
    description: '',
    quantity: 1,
    unit_price: 0,
  });

  const calculateTotal = () => {
    return lineItems.reduce((sum, item) => sum + item.amount, 0);
  };

  const handleAddLineItem = () => {
    if (!newItem.description || newItem.unit_price <= 0) return;
    
    const item: LineItem = {
      id: Date.now().toString(),
      description: newItem.description,
      quantity: newItem.quantity,
      unit_price: newItem.unit_price,
      amount: newItem.quantity * newItem.unit_price,
    };
    
    setLineItems([...lineItems, item]);
    setNewItem({ description: '', quantity: 1, unit_price: 0 });
  };

  const handleRemoveLineItem = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const handleSendInvoice = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('admin-create-invoice', {
        body: {
          customer_id: customer.id,
          customer_email: customer.email,
          customer_name: customer.full_name,
          line_items: lineItems,
          due_date: invoiceData.due_date,
          payment_terms: invoiceData.payment_terms,
          notes: invoiceData.notes,
          send_email: true,
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to create invoice');
      }

      setSuccess(true);
      
      // Close after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error('Error creating invoice:', err);
      setError(err.message || 'Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('admin-create-invoice', {
        body: {
          customer_id: customer.id,
          customer_email: customer.email,
          customer_name: customer.full_name,
          line_items: lineItems,
          due_date: invoiceData.due_date,
          payment_terms: invoiceData.payment_terms,
          notes: invoiceData.notes,
          send_email: false,
          status: 'draft',
        },
      });

      if (error) {
        throw new Error('Failed to save draft');
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to save draft');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Create Invoice</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {customer.full_name} {customer.company_name && `• ${customer.company_name}`}
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Invoice created successfully!
            </Alert>
          )}
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                value={invoiceData.due_date}
                onChange={(e) => setInvoiceData({ ...invoiceData, due_date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Payment Terms</InputLabel>
                <Select
                  value={invoiceData.payment_terms}
                  onChange={(e) => setInvoiceData({ ...invoiceData, payment_terms: e.target.value })}
                  label="Payment Terms"
                >
                  <MenuItem value="immediate">Due on Receipt</MenuItem>
                  <MenuItem value="net15">Net 15</MenuItem>
                  <MenuItem value="net30">Net 30</MenuItem>
                  <MenuItem value="net60">Net 60</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Line Items
              </Typography>
              
              <Paper variant="outlined" sx={{ p: 2 }}>
                <List>
                  {lineItems.map((item, index) => (
                    <React.Fragment key={item.id}>
                      {index > 0 && <Divider />}
                      <ListItem>
                        <ListItemText
                          primary={item.description}
                          secondary={`${item.quantity} × $${item.unit_price.toFixed(2)} = $${item.amount.toFixed(2)}`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleRemoveLineItem(item.id)}
                            disabled={lineItems.length === 1}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                  <TextField
                    size="small"
                    label="Description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    sx={{ flexGrow: 1 }}
                  />
                  <TextField
                    size="small"
                    label="Qty"
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                    sx={{ width: 80 }}
                  />
                  <TextField
                    size="small"
                    label="Price"
                    type="number"
                    value={newItem.unit_price}
                    onChange={(e) => setNewItem({ ...newItem, unit_price: parseFloat(e.target.value) || 0 })}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    sx={{ width: 120 }}
                  />
                  <IconButton
                    color="primary"
                    onClick={handleAddLineItem}
                    disabled={!newItem.description || newItem.unit_price <= 0}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={invoiceData.notes}
                onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
                placeholder="Additional notes or payment instructions..."
              />
            </Grid>
            
            <Grid item xs={12}>
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="h6" align="right">
                  Total: ${calculateTotal().toFixed(2)}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSaveDraft}
          disabled={loading || lineItems.length === 0}
          startIcon={<SaveIcon />}
        >
          Save Draft
        </Button>
        <Button
          variant="contained"
          onClick={handleSendInvoice}
          disabled={loading || lineItems.length === 0}
          startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
        >
          Send Invoice
        </Button>
      </DialogActions>
    </Dialog>
  );
};