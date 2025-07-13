import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp,
  Email,
  Campaign,
  Analytics as AnalyticsIcon,
  CheckCircle,
  Schedule,
  AttachMoney,
  ContentPaste,
  RocketLaunch,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface DashboardData {
  campaigns: any[];
  emailStats: any;
  credits: any;
  analytics: any;
}

const ClientDashboard: React.FC = () => {
  const { user, clientData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData>({
    campaigns: [],
    emailStats: null,
    credits: null,
    analytics: null,
  });

  useEffect(() => {
    if (user && clientData) {
      fetchDashboardData();
    }
  }, [user, clientData]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch user's campaigns
      const { data: campaigns } = await supabase
        .from('campaigns')
        .select('*')
        .eq('client_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch email statistics
      const { data: emailStats } = await supabase
        .from('email_campaigns')
        .select('*')
        .eq('client_id', user?.id)
        .single();

      // Fetch credit balance
      const { data: credits } = await supabase
        .from('credits')
        .select('*')
        .eq('customer_id', user?.id)
        .single();

      // Fetch analytics data
      const { data: analytics } = await supabase
        .from('analytics')
        .select('*')
        .eq('user_id', user?.id)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      setData({
        campaigns: campaigns || [],
        emailStats: emailStats || {},
        credits: credits || { amount: 0, used: 0 },
        analytics: analytics || [],
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAvailableComponents = () => {
    const features = clientData?.subscription_features?.dashboard_components || [];
    const allComponents = {
      analytics: true,
      campaigns: features.includes('campaign_manager'),
      email: features.includes('email_marketing'),
      social: features.includes('social_media'),
      content: features.includes('content_studio'),
      seo: features.includes('seo_analyzer'),
    };
    return allComponents;
  };

  const components = getAvailableComponents();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  const creditPercentage = data.credits
    ? ((data.credits.amount - data.credits.used) / data.credits.amount) * 100
    : 0;

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
          Welcome back, {clientData?.organization_name}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Chip
            label={`${clientData?.subscription_level.toUpperCase()} Plan`}
            color="primary"
            size="small"
          />
          <Typography variant="body2" color="textSecondary">
            Active Client
          </Typography>
        </Box>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <AttachMoney sx={{ color: 'primary.main' }} />
                <Typography variant="h5" sx={{ color: 'primary.main' }}>
                  {data.credits?.amount - data.credits?.used || 0}
                </Typography>
              </Box>
              <Typography color="textSecondary" variant="body2">
                Credits Remaining
              </Typography>
              <LinearProgress
                variant="determinate"
                value={creditPercentage}
                sx={{ mt: 1, height: 4, borderRadius: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>

        {components.campaigns && (
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Campaign sx={{ color: '#ff9800' }} />
                  <Typography variant="h5">{data.campaigns.filter(c => c.status === 'active').length}</Typography>
                </Box>
                <Typography color="textSecondary" variant="body2">
                  Active Campaigns
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {data.campaigns.length} total campaigns
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {components.email && (
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Email sx={{ color: '#4caf50' }} />
                  <Typography variant="h5">{data.emailStats?.sent_count || 0}</Typography>
                </Box>
                <Typography color="textSecondary" variant="body2">
                  Emails Sent
                </Typography>
                <Typography variant="caption" color="success.main">
                  {data.emailStats?.open_rate || 0}% open rate
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <TrendingUp sx={{ color: '#9c27b0' }} />
                <Typography variant="h5">{data.analytics?.length || 0}</Typography>
              </Box>
              <Typography color="textSecondary" variant="body2">
                Site Visits (30d)
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Analytics tracked
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Area */}
      <Grid container spacing={3}>
        {/* Recent Campaigns */}
        {components.campaigns && (
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Campaigns
              </Typography>
              <List>
                {data.campaigns.length === 0 ? (
                  <Alert severity="info">
                    No campaigns yet. Visit the Campaign Marketplace to get started!
                  </Alert>
                ) : (
                  data.campaigns.map((campaign, index) => (
                    <React.Fragment key={campaign.id}>
                      <ListItem>
                        <ListItemIcon>
                          {campaign.status === 'active' ? (
                            <CheckCircle color="success" />
                          ) : campaign.status === 'scheduled' ? (
                            <Schedule color="info" />
                          ) : (
                            <ContentPaste color="disabled" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={campaign.name}
                          secondary={`${campaign.type} • Created ${new Date(campaign.created_at).toLocaleDateString()}`}
                        />
                        <Chip
                          label={campaign.status}
                          size="small"
                          color={
                            campaign.status === 'active'
                              ? 'success'
                              : campaign.status === 'scheduled'
                              ? 'info'
                              : 'default'
                          }
                        />
                      </ListItem>
                      {index < data.campaigns.length - 1 && <Divider />}
                    </React.Fragment>
                  ))
                )}
              </List>
            </Paper>
          </Grid>
        )}

        {/* Quick Actions */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <List>
              {components.campaigns && (
                <ListItem
                  component="button"
                  onClick={() => window.location.hash = '#campaigns'}
                  sx={{ borderRadius: 1, mb: 1, cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                >
                  <ListItemIcon>
                    <RocketLaunch color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Browse Campaigns"
                    secondary="Find new campaigns"
                  />
                </ListItem>
              )}
              {components.email && (
                <ListItem
                  component="button"
                  onClick={() => window.location.hash = '#email'}
                  sx={{ borderRadius: 1, mb: 1, cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                >
                  <ListItemIcon>
                    <Email color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Send Email"
                    secondary="Create email campaign"
                  />
                </ListItem>
              )}
              <ListItem
                component="button"
                onClick={() => window.location.hash = '#analytics'}
                sx={{ borderRadius: 1, mb: 1, cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
              >
                <ListItemIcon>
                  <AnalyticsIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="View Analytics"
                  secondary="Track performance"
                />
              </ListItem>
            </List>
          </Paper>

          {/* Subscription Info */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Your Plan Features
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>{clientData?.subscription_level}</strong> subscription includes:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${clientData?.subscription_features?.api_calls || '1,000'} API calls/month`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${clientData?.subscription_features?.team_members || '1'} team members`}
                  />
                </ListItem>
                {clientData?.subscription_features?.custom_branding && (
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Custom branding" />
                  </ListItem>
                )}
                {clientData?.subscription_features?.priority_support && (
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Priority support" />
                  </ListItem>
                )}
              </List>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ClientDashboard;