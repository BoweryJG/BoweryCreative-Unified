import React, { useState, useEffect } from 'react';
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
  Divider,
  Snackbar,
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
  Code,
  Check,
  ContentCopy,
  Send,
  HourglassEmpty,
  AutoAwesome as Sparkles,
  CheckCircle,
} from '@mui/icons-material';
import { supabase } from '../lib/supabase';

interface ClientAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  status: 'pending' | 'active' | 'inactive' | 'trial';
  joinDate: string;
  totalSpent: number;
  monthlyAmount: number;
  accessCode: string;
  codeUsed: boolean;
  onboardingCompleted: boolean;
  paymentCompleted: boolean;
  customPackage?: {
    name: string;
    description: string;
    features: string[];
  };
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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ClientManagementEnhanced() {
  const [clients, setClients] = useState<ClientAccount[]>([]);
  
  // Hardcoded Dr. Pedro client
  const drPedroClient: ClientAccount = {
    id: 'dr-pedro-001',
    name: 'Dr. Greg Pedro',
    email: 'greg@gregpedromd.com',
    phone: '+1234567890',
    company: 'Greg Pedro MD',
    industry: 'Medical Spa',
    status: 'active',
    joinDate: '2024-01-01T00:00:00Z',
    totalSpent: 24000,
    monthlyAmount: 2000,
    accessCode: 'PEDRO',
    codeUsed: true,
    onboardingCompleted: true,
    paymentCompleted: true,
    customPackage: {
      name: 'Premium AI Infrastructure',
      description: 'Complete marketing automation with AI-powered insights',
      features: ['AI Marketing', 'Automated Campaigns', 'Real-time Analytics', 'Custom Integrations'],
    }
  };

  // Hardcoded Sarah Jones test client
  const sarahJonesClient: ClientAccount = {
    id: 'sarah-jones-001',
    name: 'Sarah Jones',
    email: 'sarah@example.com',
    phone: '+1234567890', // Update this with your phone number
    company: 'Sarah Jones Test',
    industry: 'Medical Spa',
    status: 'pending',
    joinDate: new Date().toISOString(),
    totalSpent: 0,
    monthlyAmount: 5,
    accessCode: 'SARAH',
    codeUsed: false,
    onboardingCompleted: false,
    paymentCompleted: false,
    customPackage: {
      name: 'Test Package',
      description: 'Test flow for $5/month',
      features: ['Basic Features'],
    }
  };
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<ClientAccount | null>(null);
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [sendInviteOpen, setSendInviteOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as any });
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    industry: 'Medical Spa',
    monthlyAmount: 2000,
    accessCode: '',
    customPackage: {
      name: 'Custom Package',
      description: '',
      features: [''],
    }
  });

  // Load clients from Supabase
  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const { data, error } = await supabase
        .from('client_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Always include Dr. Pedro and Sarah at the top
      const allClients = [drPedroClient, sarahJonesClient];
      
      // Add other clients from database, but filter out any duplicates
      if (data) {
        const otherClients = data.filter(client => 
          client.email !== 'greg@gregpedromd.com' && 
          client.email !== 'sarah@example.com' &&
          client.name !== 'Dr. Greg Pedro' &&
          client.name !== 'Sarah Jones'
        );
        allClients.push(...otherClients);
      }
      
      setClients(allClients);
    } catch (error) {
      console.error('Error loading clients:', error);
      // Even if there's an error, show Dr. Pedro and Sarah
      setClients([drPedroClient, sarahJonesClient]);
    }
  };

  const generateAccessCode = () => {
    // Generate code from company name or custom input
    const baseCode = newClient.company || newClient.name;
    const code = baseCode.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    setNewClient({ ...newClient, accessCode: code });
  };

  const handleAddClient = async () => {
    try {
      const client: Omit<ClientAccount, 'id'> = {
        name: newClient.name,
        email: newClient.email,
        phone: newClient.phone,
        company: newClient.company,
        industry: newClient.industry,
        status: 'pending',
        joinDate: new Date().toISOString(),
        totalSpent: 0,
        monthlyAmount: newClient.monthlyAmount,
        accessCode: newClient.accessCode,
        codeUsed: false,
        onboardingCompleted: false,
        paymentCompleted: false,
        customPackage: newClient.customPackage,
      };

      const { data, error } = await supabase
        .from('client_accounts')
        .insert([client])
        .select()
        .single();

      if (error) throw error;

      // Add new client after Dr. Pedro and Sarah
      setClients([drPedroClient, sarahJonesClient, data, ...clients.filter(c => c.id !== drPedroClient.id && c.id !== sarahJonesClient.id)]);
      setAddClientOpen(false);
      setSnackbar({ 
        open: true, 
        message: `Client account created with code: ${newClient.accessCode}`, 
        severity: 'success' 
      });
      
      // Reset form
      setNewClient({
        name: '',
        email: '',
        phone: '',
        company: '',
        industry: 'Medical Spa',
        monthlyAmount: 2000,
        accessCode: '',
        customPackage: {
          name: 'Custom Package',
          description: '',
          features: [''],
        }
      });
    } catch (error) {
      console.error('Error adding client:', error);
      setSnackbar({ 
        open: true, 
        message: 'Error creating client account', 
        severity: 'error' 
      });
    }
  };

  const sendInviteEmail = async (client: ClientAccount) => {
    try {
      // Send email with onboarding link and access code
      const { error } = await supabase.functions.invoke('send-client-invite', {
        body: {
          to: client.email,
          name: client.name,
          accessCode: client.accessCode,
          monthlyAmount: client.monthlyAmount,
          packageName: client.customPackage?.name || 'Custom Package',
        }
      });

      if (error) throw error;

      setSnackbar({ 
        open: true, 
        message: 'Invitation sent successfully!', 
        severity: 'success' 
      });
      setSendInviteOpen(false);
    } catch (error) {
      console.error('Error sending invite:', error);
      setSnackbar({ 
        open: true, 
        message: 'Error sending invitation', 
        severity: 'error' 
      });
    }
  };

  const copyAccessCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setSnackbar({ 
      open: true, 
      message: 'Access code copied to clipboard!', 
      severity: 'success' 
    });
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.accessCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (client: ClientAccount) => {
    if (client.paymentCompleted && client.onboardingCompleted) return 'success';
    if (client.codeUsed && !client.paymentCompleted) return 'warning';
    if (!client.codeUsed) return 'default';
    return 'error';
  };

  const getStatusLabel = (client: ClientAccount) => {
    if (client.paymentCompleted && client.onboardingCompleted) return 'Active';
    if (client.codeUsed && !client.paymentCompleted) return 'Awaiting Payment';
    if (!client.codeUsed) return 'Pending Setup';
    return 'Inactive';
  };

  const renderOverview = () => {
    const stats = {
      totalClients: clients.length,
      activeClients: clients.filter(c => c.paymentCompleted && c.onboardingCompleted).length,
      pendingClients: clients.filter(c => !c.codeUsed).length,
      awaitingPayment: clients.filter(c => c.codeUsed && !c.paymentCompleted).length,
      totalRevenue: clients.reduce((sum, c) => sum + c.totalSpent, 0),
      monthlyRecurring: clients.filter(c => c.paymentCompleted).reduce((sum, c) => sum + c.monthlyAmount, 0),
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
                {stats.activeClients} active, {stats.pendingClients} pending
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <HourglassEmpty sx={{ color: 'warning.main', mr: 1 }} />
                <Typography variant="h6">Awaiting Action</Typography>
              </Box>
              <Typography variant="h4" sx={{ color: 'warning.main' }}>
                {stats.awaitingPayment}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Clients who need to complete payment
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoney sx={{ color: 'success.main', mr: 1 }} />
                <Typography variant="h6">Monthly Recurring</Typography>
              </Box>
              <Typography variant="h4" sx={{ color: 'success.main' }}>
                ${stats.monthlyRecurring.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                From {stats.activeClients} active clients
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ color: 'info.main', mr: 1 }} />
                <Typography variant="h6">Total Revenue</Typography>
              </Box>
              <Typography variant="h4" sx={{ color: 'info.main' }}>
                ${stats.totalRevenue.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                All-time client spend
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Recent Activity */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Recent Client Activity</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Client</TableCell>
                  <TableCell>Access Code</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Monthly</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clients.slice(0, 5).map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2 }}>{client.name.charAt(0)}</Avatar>
                        <Box>
                          <Typography variant="body1">{client.name}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {client.company}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Code sx={{ fontSize: 16 }} />
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {client.accessCode}
                        </Typography>
                        <IconButton size="small" onClick={() => copyAccessCode(client.accessCode)}>
                          <ContentCopy sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={getStatusLabel(client)} 
                        color={getStatusColor(client) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>${client.monthlyAmount}/mo</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {!client.codeUsed && (
                          <Tooltip title="Send Invite">
                            <IconButton 
                              size="small" 
                              onClick={() => {
                                setSelectedClient(client);
                                setSendInviteOpen(true);
                              }}
                            >
                              <Send />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Send Cosmic Onboarding">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => {
                              // Copy onboarding link to clipboard
                              navigator.clipboard.writeText('https://start.bowerycreativeagency.com');
                              setSnackbar({ 
                                open: true, 
                                message: 'Cosmic onboarding link copied! Send via SMS or email.', 
                                severity: 'success' 
                              });
                            }}
                          >
                            <Sparkles />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    );
  };

  const renderClientList = () => (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField
          placeholder="Search clients..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setAddClientOpen(true)}
        >
          Create Client Account
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Client Details</TableCell>
              <TableCell>Access Code</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Package</TableCell>
              <TableCell>Monthly</TableCell>
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
                      {client.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {client.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {client.company} • {client.email}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {client.industry}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Code sx={{ fontSize: 16, color: 'primary.main' }} />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: 'monospace',
                        bgcolor: 'grey.100',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      {client.accessCode}
                    </Typography>
                    <IconButton size="small" onClick={() => copyAccessCode(client.accessCode)}>
                      <ContentCopy sx={{ fontSize: 16 }} />
                    </IconButton>
                    {client.codeUsed && (
                      <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={getStatusLabel(client)} 
                    color={getStatusColor(client) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {client.customPackage?.name || 'Standard'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    ${client.monthlyAmount}/mo
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    ${client.totalSpent.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {!client.codeUsed && (
                      <Tooltip title="Send Invite">
                        <IconButton 
                          size="small" 
                          onClick={() => {
                            setSelectedClient(client);
                            setSendInviteOpen(true);
                          }}
                        >
                          <Send />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Edit">
                      <IconButton size="small">
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="View Details">
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
    <Container maxWidth={false}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Client Management
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Create client accounts, manage access codes, and track onboarding
        </Typography>
      </Box>

      <Tabs value={selectedTab} onChange={(e, v) => setSelectedTab(v)} sx={{ mb: 3 }}>
        <Tab label="Overview" />
        <Tab label="All Clients" />
        <Tab label="Pending Setup" />
        <Tab label="Active Clients" />
      </Tabs>

      <TabPanel value={selectedTab} index={0}>
        {renderOverview()}
      </TabPanel>
      <TabPanel value={selectedTab} index={1}>
        {renderClientList()}
      </TabPanel>
      <TabPanel value={selectedTab} index={2}>
        {renderClientList()} {/* Filter for pending */}
      </TabPanel>
      <TabPanel value={selectedTab} index={3}>
        {renderClientList()} {/* Filter for active */}
      </TabPanel>

      {/* Add Client Dialog */}
      <Dialog open={addClientOpen} onClose={() => setAddClientOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Client Account</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Contact Name"
              value={newClient.name}
              onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Email"
              type="email"
              value={newClient.email}
              onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Phone"
              value={newClient.phone}
              onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
              fullWidth
            />
            <TextField
              label="Company/Practice Name"
              value={newClient.company}
              onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
              fullWidth
              required
            />
            <FormControl fullWidth>
              <InputLabel>Industry</InputLabel>
              <Select
                value={newClient.industry}
                onChange={(e) => setNewClient({ ...newClient, industry: e.target.value })}
                label="Industry"
              >
                <MenuItem value="Medical Spa">Medical Spa</MenuItem>
                <MenuItem value="Dermatology">Dermatology</MenuItem>
                <MenuItem value="Plastic Surgery">Plastic Surgery</MenuItem>
                <MenuItem value="Dental">Dental/Orthodontics</MenuItem>
                <MenuItem value="Wellness">Wellness Center</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            
            <Divider />
            
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Pricing & Access
            </Typography>
            
            <TextField
              label="Monthly Amount"
              type="number"
              value={newClient.monthlyAmount}
              onChange={(e) => setNewClient({ ...newClient, monthlyAmount: parseInt(e.target.value) })}
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                label="Access Code"
                value={newClient.accessCode}
                onChange={(e) => setNewClient({ ...newClient, accessCode: e.target.value.toUpperCase() })}
                fullWidth
                required
                helperText="Unique code the client will use to link their account"
                InputProps={{
                  sx: { fontFamily: 'monospace' }
                }}
              />
              <Button 
                variant="outlined" 
                onClick={generateAccessCode}
                sx={{ minWidth: 120 }}
              >
                Generate
              </Button>
            </Box>
            
            <TextField
              label="Package Name"
              value={newClient.customPackage.name}
              onChange={(e) => setNewClient({ 
                ...newClient, 
                customPackage: { ...newClient.customPackage, name: e.target.value }
              })}
              fullWidth
            />
            
            <TextField
              label="Package Description"
              value={newClient.customPackage.description}
              onChange={(e) => setNewClient({ 
                ...newClient, 
                customPackage: { ...newClient.customPackage, description: e.target.value }
              })}
              fullWidth
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddClientOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleAddClient} 
            variant="contained"
            disabled={!newClient.name || !newClient.email || !newClient.company || !newClient.accessCode}
          >
            Create Account
          </Button>
        </DialogActions>
      </Dialog>

      {/* Send Invite Dialog */}
      <Dialog open={sendInviteOpen} onClose={() => setSendInviteOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Send Client Invitation</DialogTitle>
        <DialogContent>
          {selectedClient && (
            <Box sx={{ pt: 2 }}>
              <Alert severity="info" sx={{ mb: 3 }}>
                This will send an email to {selectedClient.name} with instructions to complete onboarding.
              </Alert>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Client Details
                </Typography>
                <Typography variant="body1">{selectedClient.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {selectedClient.company}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {selectedClient.email}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Access Code
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: 'monospace',
                      bgcolor: 'grey.100',
                      px: 2,
                      py: 1,
                      borderRadius: 1,
                    }}
                  >
                    {selectedClient.accessCode}
                  </Typography>
                  <IconButton onClick={() => copyAccessCode(selectedClient.accessCode)}>
                    <ContentCopy />
                  </IconButton>
                </Box>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Package Details
                </Typography>
                <Typography variant="body1">
                  {selectedClient.customPackage?.name || 'Custom Package'} - ${selectedClient.monthlyAmount}/month
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSendInviteOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => selectedClient && sendInviteEmail(selectedClient)} 
            variant="contained"
            startIcon={<Send />}
          >
            Send Invitation
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}