import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Divider,
  Paper,
  Tab,
  Tabs,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Receipt as ReceiptIcon,
  Send as SendIcon,
  CreditCard as CreditCardIcon,
  Person as PersonIcon,
  AttachMoney as AttachMoneyIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { CreateCustomerModal } from './CreateCustomerModal';
import { InvoiceGenerator } from './InvoiceGenerator';
import { CustomerDetailsModal } from './CustomerDetailsModal';

interface Customer {
  id: string;
  email: string;
  full_name: string;
  company_name?: string;
  stripe_customer_id?: string;
  monthly_billing?: number;
  billing_cycle?: 'monthly' | 'annual' | 'custom';
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  api_usage_tracked?: boolean;
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
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateCustomer, setShowCreateCustomer] = useState(false);
  const [showInvoiceGenerator, setShowInvoiceGenerator] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          customers!left (stripe_customer_id),
          subscriptions!left (status, stripe_price_id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedCustomers = data?.map(profile => ({
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name || 'Unnamed Customer',
        company_name: profile.company_name,
        stripe_customer_id: profile.customers?.[0]?.stripe_customer_id,
        monthly_billing: profile.monthly_billing,
        billing_cycle: profile.billing_cycle || 'monthly',
        status: profile.subscriptions?.[0]?.status === 'active' ? 'active' : 
                profile.stripe_customer_id ? 'inactive' : 'pending',
        created_at: profile.created_at,
        api_usage_tracked: profile.api_usage_tracked || false,
      })) || [];

      setCustomers(mappedCustomers);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateInvoice = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowInvoiceGenerator(true);
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerDetails(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'pending':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography color="textSecondary" gutterBottom>
                  Total Customers
                </Typography>
              </Box>
              <Typography variant="h4">{customers.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CreditCardIcon sx={{ mr: 1, color: 'success.main' }} />
                <Typography color="textSecondary" gutterBottom>
                  Active Customers
                </Typography>
              </Box>
              <Typography variant="h4">
                {customers.filter(c => c.status === 'active').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoneyIcon sx={{ mr: 1, color: 'info.main' }} />
                <Typography color="textSecondary" gutterBottom>
                  Monthly Revenue
                </Typography>
              </Box>
              <Typography variant="h4">
                ${customers
                  .filter(c => c.status === 'active' && c.monthly_billing)
                  .reduce((sum, c) => sum + (c.monthly_billing || 0), 0)
                  .toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ReceiptIcon sx={{ mr: 1, color: 'warning.main' }} />
                <Typography color="textSecondary" gutterBottom>
                  Pending Setup
                </Typography>
              </Box>
              <Typography variant="h4">
                {customers.filter(c => c.status === 'pending').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ width: '100%' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin tabs">
          <Tab label="Customers" />
          <Tab label="Invoices" />
          <Tab label="Settings" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              placeholder="Search customers..."
              variant="outlined"
              size="small"
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
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowCreateCustomer(true)}
            >
              Add Customer
            </Button>
          </Box>

          <List>
            {filteredCustomers.map((customer, index) => (
              <React.Fragment key={customer.id}>
                {index > 0 && <Divider />}
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1">
                          {customer.full_name}
                        </Typography>
                        <Chip
                          label={customer.status}
                          size="small"
                          color={getStatusColor(customer.status)}
                        />
                        {customer.api_usage_tracked && (
                          <Chip label="API Tracked" size="small" color="info" />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          {customer.email}
                          {customer.company_name && ` • ${customer.company_name}`}
                        </Typography>
                        {customer.monthly_billing && (
                          <Typography variant="body2" color="primary">
                            ${customer.monthly_billing}/month
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="view"
                      onClick={() => handleViewCustomer(customer)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="invoice"
                      onClick={() => handleCreateInvoice(customer)}
                    >
                      <SendIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Invoice Management
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Select a customer from the Customers tab to generate an invoice.
          </Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Billing Settings
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Configure billing defaults, tax rates, and invoice templates.
          </Typography>
        </TabPanel>
      </Paper>

      {showCreateCustomer && (
        <CreateCustomerModal
          open={showCreateCustomer}
          onClose={() => setShowCreateCustomer(false)}
          onSuccess={() => {
            setShowCreateCustomer(false);
            loadCustomers();
          }}
        />
      )}

      {showInvoiceGenerator && selectedCustomer && (
        <InvoiceGenerator
          open={showInvoiceGenerator}
          customer={selectedCustomer}
          onClose={() => {
            setShowInvoiceGenerator(false);
            setSelectedCustomer(null);
          }}
        />
      )}

      {showCustomerDetails && selectedCustomer && (
        <CustomerDetailsModal
          open={showCustomerDetails}
          customer={selectedCustomer}
          onClose={() => {
            setShowCustomerDetails(false);
            setSelectedCustomer(null);
          }}
          onUpdate={() => loadCustomers()}
        />
      )}
    </Box>
  );
};