import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Alert,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add,
  Payment,
  Edit,
  Search,
  Email,
  Business,
  AttachMoney,
  TrendingUp,
  CreditCard,
} from '@mui/icons-material';
import { ClientPaymentSection } from './payments';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  status: 'active' | 'inactive' | 'trial';
  joinDate: string;
  totalSpent: number;
  subscriptionPlan?: string;
  credits: number;
  avatar?: string;
}

// Mock client data
const mockClients: Client[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah@dentalcare.com',
    phone: '(555) 123-4567',
    company: 'Johnson Dental Care',
    industry: 'Dental',
    status: 'active',
    joinDate: '2024-01-15',
    totalSpent: 2450,
    subscriptionPlan: 'Professional',
    credits: 125,
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    email: 'mchen@aestheticsplus.com',
    phone: '(555) 987-6543',
    company: 'Aesthetics Plus',
    industry: 'Medical Aesthetics',
    status: 'active',
    joinDate: '2024-02-03',
    totalSpent: 3200,
    subscriptionPlan: 'Agency',
    credits: 250,
  },
  {
    id: '3',
    name: 'Jennifer Martinez',
    email: 'jmartinez@wellnesscenter.com',
    phone: '(555) 456-7890',
    company: 'Wellness Center NYC',
    industry: 'Healthcare',
    status: 'trial',
    joinDate: '2024-12-01',
    totalSpent: 0,
    credits: 10,
  },
];

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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ClientManagement() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    industry: 'Dental',
  });

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'trial': return 'warning';
      case 'inactive': return 'error';
      default: return 'default';
    }
  };

  const handleAddClient = () => {
    const client: Client = {
      id: Date.now().toString(),
      ...newClient,
      status: 'trial',
      joinDate: new Date().toISOString().split('T')[0],
      totalSpent: 0,
      credits: 10, // Free trial credits
    };
    setClients([...clients, client]);
    setAddClientOpen(false);
    setNewClient({
      name: '',
      email: '',
      phone: '',
      company: '',
      industry: 'Dental',
    });
  };

  const renderOverview = () => {
    const stats = {
      totalClients: clients.length,
      activeClients: clients.filter(c => c.status === 'active').length,
      trialClients: clients.filter(c => c.status === 'trial').length,
      totalRevenue: clients.reduce((sum, c) => sum + c.totalSpent, 0),
      averageSpend: clients.length > 0 ? clients.reduce((sum, c) => sum + c.totalSpent, 0) / clients.length : 0,
    };

    return (
      <Box>
        {/* Stats Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3, mb: 4 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Business sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6">Total Clients</Typography>
              </Box>
              <Typography variant="h4" sx={{ color: 'primary.main' }}>
                {stats.totalClients}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {stats.activeClients} active, {stats.trialClients} on trial
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoney sx={{ color: 'success.main', mr: 1 }} />
                <Typography variant="h6">Total Revenue</Typography>
              </Box>
              <Typography variant="h4" sx={{ color: 'success.main' }}>
                ${stats.totalRevenue.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Average: ${Math.round(stats.averageSpend)} per client
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ color: 'info.main', mr: 1 }} />
                <Typography variant="h6">Growth Rate</Typography>
              </Box>
              <Typography variant="h4" sx={{ color: 'info.main' }}>
                +23%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                New clients this month
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CreditCard sx={{ color: 'warning.main', mr: 1 }} />
                <Typography variant="h6">Active Subscriptions</Typography>
              </Box>
              <Typography variant="h4" sx={{ color: 'warning.main' }}>
                {clients.filter(c => c.subscriptionPlan).length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Monthly recurring revenue
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Recent Activity */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Recent Client Activity
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Dr. Sarah Johnson just purchased 100 campaign credits - $299
          </Alert>
          <Alert severity="success" sx={{ mb: 2 }}>
            Aesthetics Plus upgraded to Agency plan - $1,299/month
          </Alert>
          <Alert severity="warning">
            Wellness Center NYC trial expires in 5 days
          </Alert>
        </Paper>
      </Box>
    );
  };

  const renderClientList = () => (
    <Box>
      {/* Search and Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <TextField
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 300 }}
        />
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setAddClientOpen(true)}
        >
          Add Client
        </Button>
      </Box>

      {/* Client Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Client</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Industry</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Subscription</TableCell>
              <TableCell>Credits</TableCell>
              <TableCell>Total Spent</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {client.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">{client.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {client.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{client.company}</TableCell>
                <TableCell>{client.industry}</TableCell>
                <TableCell>
                  <Chip 
                    label={client.status} 
                    color={getStatusColor(client.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {client.subscriptionPlan || (
                    <Typography variant="body2" color="textSecondary">
                      Trial
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={`${client.credits} credits`} 
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>${client.totalSpent.toLocaleString()}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Manage Payments">
                      <IconButton 
                        size="small"
                        onClick={() => {
                          setSelectedClient(client);
                          setPaymentModalOpen(true);
                        }}
                      >
                        <Payment />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Client">
                      <IconButton size="small">
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Send Email">
                      <IconButton size="small">
                        <Email />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
        Client Management
      </Typography>

      <Tabs value={selectedTab} onChange={(_, value) => setSelectedTab(value)} sx={{ mb: 3 }}>
        <Tab label="Overview" />
        <Tab label="All Clients" />
      </Tabs>

      <TabPanel value={selectedTab} index={0}>
        {renderOverview()}
      </TabPanel>

      <TabPanel value={selectedTab} index={1}>
        {renderClientList()}
      </TabPanel>

      {/* Add Client Dialog */}
      <Dialog open={addClientOpen} onClose={() => setAddClientOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Client</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Full Name"
              value={newClient.name}
              onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={newClient.email}
              onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
            />
            <TextField
              fullWidth
              label="Phone"
              value={newClient.phone}
              onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
            />
            <TextField
              fullWidth
              label="Company"
              value={newClient.company}
              onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
            />
            <FormControl fullWidth sx={{ gridColumn: '1 / -1' }}>
              <InputLabel>Industry</InputLabel>
              <Select
                value={newClient.industry}
                label="Industry"
                onChange={(e) => setNewClient({ ...newClient, industry: e.target.value })}
              >
                <MenuItem value="Dental">Dental</MenuItem>
                <MenuItem value="Medical Aesthetics">Medical Aesthetics</MenuItem>
                <MenuItem value="Healthcare">Healthcare</MenuItem>
                <MenuItem value="Wellness">Wellness</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddClientOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleAddClient} 
            variant="contained"
            disabled={!newClient.name || !newClient.email}
          >
            Add Client
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Management Dialog */}
      <Dialog 
        open={paymentModalOpen} 
        onClose={() => setPaymentModalOpen(false)} 
        maxWidth="lg" 
        fullWidth
      >
        <DialogTitle>
          Payment Management - {selectedClient?.name}
        </DialogTitle>
        <DialogContent sx={{ minHeight: 600 }}>
          {selectedClient && (
            <ClientPaymentSection clientId={selectedClient.id} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}