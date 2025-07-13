import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Email,
  Edit,
  Delete,
  Preview,
  Add,
  Campaign,
  AutoAwesome,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';

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
      id={`email-tabpanel-${index}`}
      aria-labelledby={`email-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const EmailMarketing: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [campaigns, setCampaigns] = useState([
    {
      id: '1',
      name: 'Monthly Health Newsletter',
      subject: 'Your Monthly Health Tips from Dr. Smith',
      status: 'sent',
      recipients: 458,
      opened: 312,
      clicked: 89,
      sentDate: '2025-06-10',
      type: 'newsletter',
    },
    {
      id: '2',
      name: 'Appointment Reminder Campaign',
      subject: 'Time for Your Annual Checkup',
      status: 'scheduled',
      recipients: 156,
      scheduledDate: '2025-06-15',
      type: 'automated',
    },
    {
      id: '3',
      name: 'New Service Announcement',
      subject: 'Introducing Our New Telehealth Services',
      status: 'draft',
      recipients: 0,
      type: 'announcement',
    },
  ]);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    subject: '',
    type: 'newsletter',
    template: '',
  });

  const [templates] = useState([
    { id: '1', name: 'Health Newsletter Template', type: 'newsletter' },
    { id: '2', name: 'Appointment Reminder', type: 'automated' },
    { id: '3', name: 'Service Announcement', type: 'announcement' },
    { id: '4', name: 'Welcome Email', type: 'automated' },
    { id: '5', name: 'Follow-up Care', type: 'automated' },
  ]);

  const [automations] = useState([
    {
      id: '1',
      name: 'Welcome Series',
      trigger: 'New Contact',
      emails: 3,
      status: 'active',
      enrolled: 234,
    },
    {
      id: '2',
      name: 'Appointment Reminders',
      trigger: '7 Days Before Appointment',
      emails: 2,
      status: 'active',
      enrolled: 156,
    },
    {
      id: '3',
      name: 'Birthday Greetings',
      trigger: 'Contact Birthday',
      emails: 1,
      status: 'paused',
      enrolled: 0,
    },
  ]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreateCampaign = () => {
    const newId = (campaigns.length + 1).toString();
    setCampaigns([
      {
        ...newCampaign,
        id: newId,
        status: 'draft',
        recipients: 0,
        opened: 0,
        clicked: 0,
        sentDate: '',
      },
      ...campaigns,
    ]);
    setCreateDialogOpen(false);
    setNewCampaign({ name: '', subject: '', type: 'newsletter', template: '' });
  };

  const renderCampaigns = () => (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Email Campaigns</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Create Campaign
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Campaign Name</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Recipients</TableCell>
              <TableCell>Performance</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell>{campaign.name}</TableCell>
                <TableCell>{campaign.subject}</TableCell>
                <TableCell>
                  <Chip
                    label={campaign.status}
                    size="small"
                    color={
                      campaign.status === 'sent'
                        ? 'success'
                        : campaign.status === 'scheduled'
                        ? 'warning'
                        : 'default'
                    }
                  />
                </TableCell>
                <TableCell>{campaign.recipients}</TableCell>
                <TableCell>
                  {campaign.status === 'sent' && (
                    <Box>
                      <Typography variant="caption" display="block">
                        Opens: {campaign.opened} ({Math.round((campaign.opened! / campaign.recipients) * 100)}%)
                      </Typography>
                      <Typography variant="caption" display="block">
                        Clicks: {campaign.clicked} ({Math.round((campaign.clicked! / campaign.recipients) * 100)}%)
                      </Typography>
                    </Box>
                  )}
                </TableCell>
                <TableCell>
                  {campaign.sentDate || campaign.scheduledDate || '-'}
                </TableCell>
                <TableCell>
                  <IconButton size="small">
                    <Preview />
                  </IconButton>
                  <IconButton size="small">
                    <Edit />
                  </IconButton>
                  <IconButton size="small">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );

  const renderAutomations = () => (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Email Automations</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
        >
          Create Automation
        </Button>
      </Box>

      <Grid container spacing={3}>
        {automations.map((automation) => (
          <Grid size={{ xs: 12, md: 4 }} key={automation.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">{automation.name}</Typography>
                  <Chip
                    label={automation.status}
                    size="small"
                    color={automation.status === 'active' ? 'success' : 'default'}
                  />
                </Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Trigger: {automation.trigger}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Emails in series: {automation.emails}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Enrolled: {automation.enrolled} contacts
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button size="small" variant="outlined">
                    Edit
                  </Button>
                  <Button size="small" variant="outlined">
                    {automation.status === 'active' ? 'Pause' : 'Activate'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );

  const renderTemplates = () => (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Email Templates</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
        >
          Create Template
        </Button>
      </Box>

      <Grid container spacing={3}>
        {templates.map((template) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={template.id}>
            <Card sx={{ cursor: 'pointer' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {template.name}
                </Typography>
                <Chip label={template.type} size="small" />
                <Box sx={{ mt: 2 }}>
                  <Button size="small" variant="text">
                    Preview
                  </Button>
                  <Button size="small" variant="text">
                    Edit
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );

  const renderAnalytics = () => (
    <>
      <Typography variant="h6" gutterBottom>
        Email Analytics
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Sent
              </Typography>
              <Typography variant="h4">
                1,247
              </Typography>
              <Typography variant="body2" color="success.main">
                +12% from last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Open Rate
              </Typography>
              <Typography variant="h4">
                68.2%
              </Typography>
              <Typography variant="body2" color="success.main">
                +5.3% from average
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Click Rate
              </Typography>
              <Typography variant="h4">
                19.4%
              </Typography>
              <Typography variant="body2" color="warning.main">
                -2.1% from average
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Unsubscribe Rate
              </Typography>
              <Typography variant="h4">
                0.8%
              </Typography>
              <Typography variant="body2" color="success.main">
                Below industry avg
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ mt: 3, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Campaign Performance
        </Typography>
        <Alert severity="info" sx={{ mt: 2 }}>
          Campaign analytics visualization will be displayed here
        </Alert>
      </Paper>
    </>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', mb: 3 }}>
        Email Marketing
      </Typography>

      <Paper sx={{ width: '100%' }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Campaigns" icon={<Campaign />} iconPosition="start" />
          <Tab label="Automations" icon={<AutoAwesome />} iconPosition="start" />
          <Tab label="Templates" icon={<Email />} iconPosition="start" />
          <Tab label="Analytics" icon={<AnalyticsIcon />} iconPosition="start" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          <TabPanel value={tabValue} index={0}>
            {renderCampaigns()}
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            {renderAutomations()}
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            {renderTemplates()}
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            {renderAnalytics()}
          </TabPanel>
        </Box>
      </Paper>

      {/* Create Campaign Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Email Campaign</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Campaign Name"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Subject Line"
                value={newCampaign.subject}
                onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                select
                fullWidth
                label="Campaign Type"
                value={newCampaign.type}
                onChange={(e) => setNewCampaign({ ...newCampaign, type: e.target.value })}
              >
                <MenuItem value="newsletter">Newsletter</MenuItem>
                <MenuItem value="announcement">Announcement</MenuItem>
                <MenuItem value="promotion">Promotion</MenuItem>
                <MenuItem value="automated">Automated</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                select
                fullWidth
                label="Template"
                value={newCampaign.template}
                onChange={(e) => setNewCampaign({ ...newCampaign, template: e.target.value })}
              >
                <MenuItem value="">Start from scratch</MenuItem>
                {templates.map((template) => (
                  <MenuItem key={template.id} value={template.id}>
                    {template.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateCampaign} variant="contained">
            Create Campaign
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EmailMarketing;