import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Grid2 as Grid,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
  Tooltip,
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  Send as SendIcon,
  Message as MessageIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Schedule,
  CheckCircle,
  Cancel,
  Pending,
  Link as LinkIcon,
  ContentCopy as ContentCopyIcon,
} from '@mui/icons-material';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

interface Invoice {
  id: string;
  invoice_number: string;
  client_id: string;
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  stripe_invoice_id?: string;
  amount_due: number;
  amount_paid: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'void';
  due_date: string;
  paid_date?: string;
  line_items: Array<{
    id: string;
    description: string;
    quantity: number;
    unit_price: number;
    amount: number;
  }>;
  metadata?: any;
  created_at: string;
  payment_link?: string;
}

interface SMSDialogProps {
  open: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  onSend: (phone: string, message: string) => void;
}

const SMSDialog: React.FC<SMSDialogProps> = ({ open, onClose, invoice, onSend }) => {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'invoice' | 'onboarding'>('invoice');

  useEffect(() => {
    if (invoice) {
      if (messageType === 'invoice') {
        const paymentUrl = invoice.payment_link || `https://bowerycreativeagency.com/quick-pay.html?amount=${invoice.amount_due}&invoice=${invoice.invoice_number}`;
        const defaultMessage = `Hi ${invoice.client_name || 'there'}, your invoice ${invoice.invoice_number} for $${invoice.amount_due.toFixed(2)} is ready. Pay securely here: ${paymentUrl}`;
        setMessage(defaultMessage);
      } else {
        const onboardingMessage = `Hi ${invoice.client_name || 'there'}, welcome to Bowery Creative! Get started with our cosmic onboarding experience: https://start.bowerycreativeagency.com`;
        setMessage(onboardingMessage);
      }
      setPhone(invoice.client_phone || '');
    }
  }, [invoice, messageType]);

  const handleSend = () => {
    onSend(phone, message);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Send Invoice via SMS</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Message Type</InputLabel>
            <Select
              value={messageType}
              onChange={(e) => setMessageType(e.target.value as 'invoice' | 'onboarding')}
              label="Message Type"
            >
              <MenuItem value="invoice">Invoice Payment Link</MenuItem>
              <MenuItem value="onboarding">Cosmic Onboarding Link</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 123-4567"
            fullWidth
          />
          <TextField
            label="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            multiline
            rows={4}
            fullWidth
            helperText={`${message.length}/160 characters`}
          />
          <Alert severity="info">
            {messageType === 'onboarding' 
              ? 'Send the cosmic onboarding experience link to your client!'
              : 'SMS will be sent via Twilio. Standard messaging rates may apply.'
            }
          </Alert>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSend} 
          variant="contained" 
          startIcon={<MessageIcon />}
          disabled={!phone || !message}
        >
          Send SMS
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const InvoiceManagement: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [smsDialogOpen, setSmsDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const { data: invoicesData, error: invoicesError } = await supabase
        .from('invoices')
        .select(`
          *,
          profiles!invoices_client_id_fkey (
            id,
            full_name,
            email,
            company_name
          )
        `)
        .order('created_at', { ascending: false });

      if (invoicesError) throw invoicesError;

      const mappedInvoices = invoicesData?.map(invoice => ({
        ...invoice,
        client_name: invoice.profiles?.full_name || 'Unknown Client',
        client_email: invoice.profiles?.email || '',
        client_phone: invoice.profiles?.phone || '',
      })) || [];

      // Always add both invoices for Dr. Pedro
      const hasPedroMonthly = mappedInvoices.some(inv => 
        inv.invoice_number === 'INV-2024-001' || inv.amount_due === 2000
      );
      
      const hasPedroTest = mappedInvoices.some(inv => 
        inv.invoice_number === 'TEST-FLOW-001' || inv.amount_due === 1
      );
      
      // Add the $2000 monthly invoice
      if (!hasPedroMonthly) {
        mappedInvoices.unshift({
          id: 'pedro-invoice-001',
          invoice_number: 'INV-2024-001',
          client_id: 'dr-pedro-001',
          client_name: 'Dr. Greg Pedro',
          client_email: 'greg@gregpedromd.com',
          client_phone: '+1234567890',
          amount_due: 2000.00,
          amount_paid: 0,
          currency: 'USD',
          status: 'sent',
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          line_items: [{
            id: '1',
            description: 'Premium AI Infrastructure - Monthly Marketing Services',
            quantity: 1,
            unit_price: 2000.00,
            amount: 2000.00,
          }],
          created_at: new Date().toISOString(),
          payment_link: `https://start.bowerycreativeagency.com/pay/pedro-monthly`
        } as Invoice);
      }
      
      // Add the $1 test invoice  
      if (!hasPedroTest) {
        mappedInvoices.push({
          id: 'test-pedro-001',
          invoice_number: 'TEST-FLOW-001',
          client_id: 'dr-pedro-001',
          client_name: 'Dr. Greg Pedro',
          client_email: 'greg@gregpedromd.com',
          client_phone: '+1234567890',
          amount_due: 1.00,
          amount_paid: 0,
          currency: 'USD',
          status: 'sent',
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          line_items: [{
            id: '1',
            description: 'Test Invoice - Payment Flow Test',
            quantity: 1,
            unit_price: 1.00,
            amount: 1.00,
          }],
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          payment_link: `https://start.bowerycreativeagency.com/pay/test-flow`
        } as Invoice);
      }

      // Add Sarah Jones $5 test invoice
      const hasSarahInvoice = mappedInvoices.some(inv => 
        inv.client_name === 'Sarah Jones' || inv.invoice_number === 'SARAH-TEST-001'
      );
      
      if (!hasSarahInvoice) {
        mappedInvoices.push({
          id: 'sarah-invoice-001',
          invoice_number: 'SARAH-TEST-001',
          client_id: 'sarah-jones-001',
          client_name: 'Sarah Jones',
          client_email: 'sarah@example.com',
          client_phone: '+1234567890', // Update with your phone
          amount_due: 5.00,
          amount_paid: 0,
          currency: 'USD',
          status: 'sent',
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          line_items: [{
            id: '1',
            description: 'Test Package - Monthly Subscription',
            quantity: 1,
            unit_price: 5.00,
            amount: 5.00,
          }],
          created_at: new Date().toISOString(),
          payment_link: `https://start.bowerycreativeagency.com/pay/sarah-test`
        } as Invoice);
      }

      setInvoices(mappedInvoices);

      // Check for Dr. Greg Pedro
      const drPedroInvoices = mappedInvoices.filter(inv => 
        inv.client_name?.toLowerCase().includes('greg pedro') ||
        inv.client_name?.toLowerCase().includes('dr. pedro')
      );

      if (drPedroInvoices.length === 0) {
        // Create a sample invoice for Dr. Greg Pedro if none exists
        createDrPedroInvoice();
      }
    } catch (err: any) {
      console.error('Error loading invoices:', err);
      setError('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const createDrPedroInvoice = async () => {
    try {
      // First, ensure Dr. Pedro exists in profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('full_name', 'Dr. Greg Pedro')
        .single();

      if (profile) {
        const { error } = await supabase.functions.invoke('admin-create-invoice', {
          body: {
            customer_id: profile.id,
            customer_email: 'greg@gregpedromd.com',
            customer_name: 'Dr. Greg Pedro',
            line_items: [{
              id: '1',
              description: 'Monthly Marketing Services - Premium Package',
              quantity: 1,
              unit_price: 2000,
              amount: 2000,
            }],
            due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            payment_terms: 'net30',
            notes: 'Thank you for your continued business!',
            send_email: false,
            status: 'sent'
          },
        });

        if (!error) {
          loadInvoices(); // Reload to show the new invoice
        }
      }
    } catch (err) {
      console.error('Error creating Dr. Pedro invoice:', err);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />;
      case 'sent':
        return <Schedule sx={{ color: 'info.main', fontSize: 20 }} />;
      case 'overdue':
        return <Cancel sx={{ color: 'error.main', fontSize: 20 }} />;
      case 'draft':
        return <Pending sx={{ color: 'warning.main', fontSize: 20 }} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'sent': return 'info';
      case 'overdue': return 'error';
      case 'draft': return 'warning';
      case 'void': return 'default';
      default: return 'default';
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client_email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const generatePaymentLink = async (invoice: Invoice) => {
    try {
      setError(null);
      const { data, error } = await supabase.functions.invoke('create-payment-link', {
        body: {
          invoice_id: invoice.id,
        },
      });

      if (error) throw error;

      if (data?.payment_link) {
        // Reload invoices to show the new payment link
        await loadInvoices();
        setSuccessMessage(`Payment link generated for invoice ${invoice.invoice_number}`);
        
        // Copy to clipboard
        navigator.clipboard.writeText(data.payment_link);
        setSuccessMessage(`Payment link copied to clipboard!`);
      }
    } catch (err: any) {
      console.error('Error generating payment link:', err);
      setError('Failed to generate payment link');
    }
  };

  const handleSendSMS = async (phone: string, message: string) => {
    try {
      setError(null);
      // In a real implementation, this would call a Twilio function
      const { error } = await supabase.functions.invoke('send-invoice-sms', {
        body: {
          to: phone,
          message: message,
          invoiceId: selectedInvoice?.id,
        },
      });

      if (error) throw error;

      setSuccess('SMS sent successfully!');
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      console.error('Error sending SMS:', err);
      setError('Failed to send SMS. Feature coming soon!');
      setTimeout(() => setError(null), 5000);
    }
  };

  const stats = {
    total: invoices.length,
    totalAmount: invoices.reduce((sum, inv) => sum + inv.amount_due, 0),
    paid: invoices.filter(inv => inv.status === 'paid').length,
    paidAmount: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount_due, 0),
    pending: invoices.filter(inv => inv.status === 'sent').length,
    pendingAmount: invoices.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + inv.amount_due, 0),
    overdue: invoices.filter(inv => inv.status === 'overdue').length,
    overdueAmount: invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount_due, 0),
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Invoice Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ReceiptIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography color="textSecondary" variant="body2">
                  Total Invoices
                </Typography>
              </Box>
              <Typography variant="h4">{stats.total}</Typography>
              <Typography variant="body2" color="textSecondary">
                ${stats.totalAmount.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckCircle sx={{ color: 'success.main', mr: 1 }} />
                <Typography color="textSecondary" variant="body2">
                  Paid
                </Typography>
              </Box>
              <Typography variant="h4" color="success.main">{stats.paid}</Typography>
              <Typography variant="body2" color="textSecondary">
                ${stats.paidAmount.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Schedule sx={{ color: 'info.main', mr: 1 }} />
                <Typography color="textSecondary" variant="body2">
                  Pending
                </Typography>
              </Box>
              <Typography variant="h4" color="info.main">{stats.pending}</Typography>
              <Typography variant="body2" color="textSecondary">
                ${stats.pendingAmount.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Cancel sx={{ color: 'error.main', mr: 1 }} />
                <Typography color="textSecondary" variant="body2">
                  Overdue
                </Typography>
              </Box>
              <Typography variant="h4" color="error.main">{stats.overdue}</Typography>
              <Typography variant="body2" color="textSecondary">
                ${stats.overdueAmount.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          placeholder="Search invoices..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1, maxWidth: 400 }}
        />
        
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Status"
            startAdornment={<FilterListIcon sx={{ mr: 1, color: 'action.active' }} />}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="sent">Sent</MenuItem>
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="overdue">Overdue</MenuItem>
            <MenuItem value="void">Void</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Invoice Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Invoice #</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Loading invoices...
                </TableCell>
              </TableRow>
            ) : filteredInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No invoices found
                </TableCell>
              </TableRow>
            ) : (
              filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {invoice.invoice_number}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {format(new Date(invoice.created_at), 'MMM d, yyyy')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{invoice.client_name}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {invoice.client_email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      ${invoice.amount_due.toFixed(2)}
                    </Typography>
                    {invoice.amount_paid > 0 && (
                      <Typography variant="caption" color="success.main">
                        Paid: ${invoice.amount_paid.toFixed(2)}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {format(new Date(invoice.due_date), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getStatusIcon(invoice.status)}
                      <Chip
                        label={invoice.status}
                        color={getStatusColor(invoice.status) as any}
                        size="small"
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Tooltip title="View Invoice">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setViewDialogOpen(true);
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title={invoice.payment_link ? "Copy Payment Link" : "Generate Payment Link"}>
                        <IconButton
                          size="small"
                          onClick={() => {
                            if (invoice.payment_link) {
                              navigator.clipboard.writeText(invoice.payment_link);
                              setSuccessMessage('Payment link copied to clipboard!');
                            } else {
                              generatePaymentLink(invoice);
                            }
                          }}
                          disabled={invoice.status === 'paid'}
                          color={invoice.payment_link ? "primary" : "default"}
                        >
                          {invoice.payment_link ? <ContentCopyIcon /> : <LinkIcon />}
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Send via Email">
                        <IconButton size="small" disabled={invoice.status === 'paid'}>
                          <SendIcon />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Send via SMS">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setSmsDialogOpen(true);
                          }}
                          disabled={invoice.status === 'paid'}
                        >
                          <MessageIcon />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Download PDF">
                        <IconButton size="small">
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* SMS Dialog */}
      <SMSDialog
        open={smsDialogOpen}
        onClose={() => setSmsDialogOpen(false)}
        invoice={selectedInvoice}
        onSend={handleSendSMS}
      />

      {/* View Invoice Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Invoice {selectedInvoice?.invoice_number}
        </DialogTitle>
        <DialogContent>
          {selectedInvoice && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary">Client</Typography>
                  <Typography variant="body1">{selectedInvoice.client_name}</Typography>
                  <Typography variant="body2" color="textSecondary">{selectedInvoice.client_email}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                  <Chip
                    label={selectedInvoice.status}
                    color={getStatusColor(selectedInvoice.status) as any}
                    size="small"
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary">Due Date</Typography>
                  <Typography variant="body1">
                    {format(new Date(selectedInvoice.due_date), 'MMMM d, yyyy')}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary">Total Amount</Typography>
                  <Typography variant="h5" color="primary">
                    ${selectedInvoice.amount_due.toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>

              {selectedInvoice.payment_link && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Payment Link
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      value={selectedInvoice.payment_link}
                      fullWidth
                      size="small"
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <IconButton
                            size="small"
                            onClick={() => {
                              navigator.clipboard.writeText(selectedInvoice.payment_link!);
                              setSuccessMessage('Payment link copied!');
                            }}
                          >
                            <ContentCopyIcon />
                          </IconButton>
                        ),
                      }}
                    />
                  </Box>
                </Box>
              )}

              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Line Items</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Qty</TableCell>
                      <TableCell align="right">Unit Price</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedInvoice.line_items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">${item.unit_price.toFixed(2)}</TableCell>
                        <TableCell align="right">${item.amount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {selectedInvoice.payment_link && (
                <Alert severity="info" sx={{ mt: 3 }}>
                  <Typography variant="body2">
                    Payment Link: <a href={selectedInvoice.payment_link} target="_blank" rel="noopener noreferrer">
                      {selectedInvoice.payment_link}
                    </a>
                  </Typography>
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};