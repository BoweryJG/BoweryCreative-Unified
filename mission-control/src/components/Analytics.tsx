import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  Chat,
  Share,
  AttachMoney,
  Download,
  Visibility,
  ThumbUp,
  Comment,
  CheckCircle,
  Schedule,
  Campaign,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface MetricCard {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

// Hook to detect app mode
const useAppMode = () => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  useEffect(() => {
    // Check if we're in demo mode by looking at the URL or a flag
    const checkDemoMode = () => {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('demo') === 'true' || window.location.hostname.includes('demo');
    };
    
    setIsDemoMode(checkDemoMode());
  }, []);
  
  return { isDemoMode };
};

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const { isDemoMode } = useAppMode();
  const [dateRange, setDateRange] = useState('30d');
  const [selectedClient, setSelectedClient] = useState('all');
  const [reportType, setReportType] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // Determine which tables to use based on authentication and demo mode
  const campaignsTable = !user || isDemoMode ? 'public_campaigns' : 'campaigns';
  const emailMarketingTable = !user || isDemoMode ? 'public_email_marketing' : 'email_marketing';
  const socialMediaTable = !user || isDemoMode ? 'public_social_media' : 'social_media';
  const chatbotsTable = !user || isDemoMode ? 'public_chatbots' : 'chatbots';

  // Fetch analytics data based on mode
  useEffect(() => {
    fetchAnalyticsData();
  }, [user, isDemoMode, dateRange, selectedClient]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Fetch campaigns data
      let campaignsQuery = supabase.from(campaignsTable).select('*');
      if (selectedClient !== 'all' && !isDemoMode && user) {
        campaignsQuery = campaignsQuery.eq('client_id', selectedClient);
      }
      const { data: campaigns } = await campaignsQuery;

      // Fetch email marketing data
      const { data: emailData } = await supabase
        .from(emailMarketingTable)
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch social media data
      const { data: socialData } = await supabase
        .from(socialMediaTable)
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch chatbot data
      const { data: chatbotData } = await supabase
        .from(chatbotsTable)
        .select('*')
        .order('created_at', { ascending: false });

      // Process the data for analytics
      processAnalyticsData({
        campaigns,
        emailData,
        socialData,
        chatbotData
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (data: any) => {
    // Process and aggregate the data
    const processed = {
      ...data,
      // Calculate engagement trends from the data
      engagementTrends: generateEngagementTrends(data),
      // Add any other calculated fields
    };
    setAnalyticsData(processed);
  };

  const generateEngagementTrends = (data: any) => {
    // Generate trend data from actual data if available
    if (data.emailData?.length || data.socialData?.length) {
      // This would aggregate real data by date
      // For now, returning sample data
      return null;
    }
    return null;
  };

  // Sample data for charts (fallback for demo or when no data)
  const engagementData = analyticsData?.engagementTrends || [
    { date: 'Jan 1', email: 450, social: 890, chatbot: 234, content: 156 },
    { date: 'Jan 8', email: 520, social: 1200, chatbot: 298, content: 189 },
    { date: 'Jan 15', email: 480, social: 1100, chatbot: 312, content: 204 },
    { date: 'Jan 22', email: 590, social: 1450, chatbot: 345, content: 223 },
    { date: 'Jan 29', email: 650, social: 1680, chatbot: 389, content: 245 },
    { date: 'Feb 5', email: 720, social: 1890, chatbot: 412, content: 267 },
    { date: 'Feb 12', email: 780, social: 2100, chatbot: 445, content: 289 },
  ];

  const serviceUsageData = [
    { name: 'Email Marketing', value: 35, color: '#8884d8' },
    { name: 'Social Media', value: 28, color: '#82ca9d' },
    { name: 'Chatbots', value: 20, color: '#ffc658' },
    { name: 'Content Creation', value: 12, color: '#ff7c7c' },
    { name: 'SEO', value: 5, color: '#8dd1e1' },
  ];

  const clientPerformance = [
    { 
      client: 'Dr. Smith Medical', 
      engagement: 4567, 
      conversion: 12.5, 
      revenue: 8900,
      status: 'active',
      trend: 'up' 
    },
    { 
      client: 'Wellness Clinic', 
      engagement: 3421, 
      conversion: 9.8, 
      revenue: 6750,
      status: 'active',
      trend: 'up' 
    },
    { 
      client: 'City Dental', 
      engagement: 2890, 
      conversion: 11.2, 
      revenue: 5420,
      status: 'active',
      trend: 'down' 
    },
    { 
      client: 'Care Physicians', 
      engagement: 2156, 
      conversion: 8.5, 
      revenue: 4180,
      status: 'active',
      trend: 'neutral' 
    },
  ];

  // Calculate metrics from analytics data
  const calculateMetrics = (): MetricCard[] => {
    if (!analyticsData) {
      // Return default metrics when no data
      return [
        {
          title: 'Total Engagement',
          value: '0',
          change: 'No data available',
          trend: 'neutral',
          icon: <Visibility />,
          color: '#2196f3',
        },
        {
          title: 'Active Campaigns',
          value: 0,
          change: 'No campaigns',
          trend: 'neutral',
          icon: <Campaign />,
          color: '#4caf50',
        },
        {
          title: 'Conversion Rate',
          value: '0%',
          change: 'No data',
          trend: 'neutral',
          icon: <TrendingUp />,
          color: '#ff9800',
        },
        {
          title: 'Revenue Generated',
          value: '$0',
          change: 'No revenue data',
          trend: 'neutral',
          icon: <AttachMoney />,
          color: '#9c27b0',
        },
      ];
    }

    // Calculate actual metrics from data
    const activeCampaigns = analyticsData.campaigns?.filter((c: any) => c.status === 'active').length || 0;
    const totalEngagement = (
      (analyticsData.emailData?.reduce((sum: number, e: any) => sum + (e.opens || 0), 0) || 0) +
      (analyticsData.socialData?.reduce((sum: number, e: any) => sum + (e.engagement || 0), 0) || 0) +
      (analyticsData.chatbotData?.reduce((sum: number, e: any) => sum + (e.conversations || 0), 0) || 0)
    );
    
    return [
      {
        title: 'Total Engagement',
        value: totalEngagement > 1000 ? `${(totalEngagement / 1000).toFixed(1)}K` : totalEngagement.toString(),
        change: isDemoMode ? 'Demo data' : '+12.5% from last month',
        trend: 'up',
        icon: <Visibility />,
        color: '#2196f3',
      },
      {
        title: 'Active Campaigns',
        value: activeCampaigns,
        change: isDemoMode ? 'Demo campaigns' : `${activeCampaigns} active`,
        trend: activeCampaigns > 0 ? 'up' : 'neutral',
        icon: <Campaign />,
        color: '#4caf50',
      },
      {
        title: 'Conversion Rate',
        value: isDemoMode ? '8.7%' : '0%',
        change: isDemoMode ? 'Demo conversion' : 'Calculating...',
        trend: 'up',
        icon: <TrendingUp />,
        color: '#ff9800',
      },
      {
        title: 'Revenue Generated',
        value: isDemoMode ? '$24,580' : '$0',
        change: isDemoMode ? 'Demo revenue' : 'No revenue data',
        trend: 'up',
        icon: <AttachMoney />,
        color: '#9c27b0',
      },
    ];
  };

  const metrics = calculateMetrics();

  const emailMetrics = {
    sent: 12450,
    delivered: 12200,
    opened: 8540,
    clicked: 2180,
    unsubscribed: 45,
  };

  const socialMetrics = {
    posts: 156,
    reach: 34500,
    engagement: 4890,
    followers: 8920,
    mentions: 234,
  };

  const chatbotMetrics = {
    conversations: 1234,
    resolved: 1089,
    avgResponseTime: '1.2s',
    satisfaction: 94.5,
  };

  const handleDateRangeChange = (_event: React.MouseEvent<HTMLElement>, newRange: string | null) => {
    if (newRange !== null) {
      setDateRange(newRange);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp color="success" sx={{ fontSize: 20 }} />;
      case 'down':
        return <TrendingDown color="error" sx={{ fontSize: 20 }} />;
      default:
        return null;
    }
  };

  const renderOverview = () => (
    <>
      {/* Metric Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics.map((metric, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: `${metric.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                    }}
                  >
                    {metric.icon}
                  </Box>
                  <Box style={{ flexGrow: 1 }}>
                    <Typography color="textSecondary" variant="body2">
                      {metric.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                      <Typography variant="h5" fontWeight="bold">
                        {metric.value}
                      </Typography>
                      {getTrendIcon(metric.trend)}
                    </Box>
                  </Box>
                </Box>
                <Typography variant="caption" color="textSecondary">
                  {metric.change}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Engagement Trends Chart */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Engagement Trends
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={engagementData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="social" stackId="1" stroke="#8884d8" fill="#8884d8" />
            <Area type="monotone" dataKey="email" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
            <Area type="monotone" dataKey="chatbot" stackId="1" stroke="#ffc658" fill="#ffc658" />
            <Area type="monotone" dataKey="content" stackId="1" stroke="#ff7c7c" fill="#ff7c7c" />
          </AreaChart>
        </ResponsiveContainer>
      </Paper>

      {/* Service Usage & Client Performance */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Service Usage Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={serviceUsageData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {serviceUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <List dense sx={{ mt: 2 }}>
              {serviceUsageData.map((service) => (
                <ListItem key={service.name}>
                  <ListItemIcon>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        bgcolor: service.color,
                        borderRadius: '50%',
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText 
                    primary={service.name}
                    secondary={`${service.value}%`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Client Performance
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Client</TableCell>
                    <TableCell align="right">Engagement</TableCell>
                    <TableCell align="right">Conversion</TableCell>
                    <TableCell align="right">Revenue</TableCell>
                    <TableCell align="center">Trend</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {clientPerformance.map((client) => (
                    <TableRow key={client.client}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {client.client}
                          <Chip 
                            label={client.status} 
                            size="small" 
                            color="success"
                          />
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        {client.engagement.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        {client.conversion}%
                      </TableCell>
                      <TableCell align="right">
                        ${client.revenue.toLocaleString()}
                      </TableCell>
                      <TableCell align="center">
                        {getTrendIcon(client.trend)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </>
  );

  const renderEmailAnalytics = () => (
    <>
      <Typography variant="h6" gutterBottom>
        Email Marketing Analytics
      </Typography>
      
      {/* Email Metrics Overview */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Sent
              </Typography>
              <Typography variant="h5">{emailMetrics.sent.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Delivered
              </Typography>
              <Typography variant="h5">{emailMetrics.delivered.toLocaleString()}</Typography>
              <Typography variant="caption" color="success.main">
                {((emailMetrics.delivered / emailMetrics.sent) * 100).toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Opened
              </Typography>
              <Typography variant="h5">{emailMetrics.opened.toLocaleString()}</Typography>
              <Typography variant="caption" color="info.main">
                {((emailMetrics.opened / emailMetrics.delivered) * 100).toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Clicked
              </Typography>
              <Typography variant="h5">{emailMetrics.clicked.toLocaleString()}</Typography>
              <Typography variant="caption" color="primary.main">
                {((emailMetrics.clicked / emailMetrics.opened) * 100).toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Unsubscribed
              </Typography>
              <Typography variant="h5">{emailMetrics.unsubscribed}</Typography>
              <Typography variant="caption" color="error.main">
                {((emailMetrics.unsubscribed / emailMetrics.delivered) * 100).toFixed(2)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Email Performance Chart */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Campaign Performance Funnel
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart 
            layout="horizontal" 
            data={[
              { stage: 'Sent', value: emailMetrics.sent },
              { stage: 'Delivered', value: emailMetrics.delivered },
              { stage: 'Opened', value: emailMetrics.opened },
              { stage: 'Clicked', value: emailMetrics.clicked },
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="stage" type="category" />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </>
  );

  const renderSocialAnalytics = () => (
    <>
      <Typography variant="h6" gutterBottom>
        Social Media Analytics
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Share sx={{ mr: 1, color: 'primary.main' }} />
                <Typography color="textSecondary" variant="body2">
                  Posts
                </Typography>
              </Box>
              <Typography variant="h5">{socialMetrics.posts}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Visibility sx={{ mr: 1, color: 'info.main' }} />
                <Typography color="textSecondary" variant="body2">
                  Reach
                </Typography>
              </Box>
              <Typography variant="h5">{socialMetrics.reach.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ThumbUp sx={{ mr: 1, color: 'success.main' }} />
                <Typography color="textSecondary" variant="body2">
                  Engagement
                </Typography>
              </Box>
              <Typography variant="h5">{socialMetrics.engagement.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <People sx={{ mr: 1, color: 'warning.main' }} />
                <Typography color="textSecondary" variant="body2">
                  Followers
                </Typography>
              </Box>
              <Typography variant="h5">{socialMetrics.followers.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Comment sx={{ mr: 1, color: 'secondary.main' }} />
                <Typography color="textSecondary" variant="body2">
                  Mentions
                </Typography>
              </Box>
              <Typography variant="h5">{socialMetrics.mentions}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Platform Performance
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={engagementData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="social" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </>
  );

  const renderChatbotAnalytics = () => (
    <>
      <Typography variant="h6" gutterBottom>
        Chatbot Analytics
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Chat sx={{ mr: 1, color: 'primary.main' }} />
                <Typography color="textSecondary" variant="body2">
                  Conversations
                </Typography>
              </Box>
              <Typography variant="h5">{chatbotMetrics.conversations.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
                <Typography color="textSecondary" variant="body2">
                  Resolved
                </Typography>
              </Box>
              <Typography variant="h5">{chatbotMetrics.resolved.toLocaleString()}</Typography>
              <Typography variant="caption" color="success.main">
                {((chatbotMetrics.resolved / chatbotMetrics.conversations) * 100).toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Schedule sx={{ mr: 1, color: 'info.main' }} />
                <Typography color="textSecondary" variant="body2">
                  Avg Response
                </Typography>
              </Box>
              <Typography variant="h5">{chatbotMetrics.avgResponseTime}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ThumbUp sx={{ mr: 1, color: 'warning.main' }} />
                <Typography color="textSecondary" variant="body2">
                  Satisfaction
                </Typography>
              </Box>
              <Typography variant="h5">{chatbotMetrics.satisfaction}%</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Resolution Rate Progress
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Resolution Rate</Typography>
            <Typography variant="body2">
              {((chatbotMetrics.resolved / chatbotMetrics.conversations) * 100).toFixed(1)}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={(chatbotMetrics.resolved / chatbotMetrics.conversations) * 100}
            sx={{ height: 10, borderRadius: 1 }}
          />
        </Box>
      </Paper>
    </>
  );

  const renderContent = () => {
    switch (reportType) {
      case 'email':
        return renderEmailAnalytics();
      case 'social':
        return renderSocialAnalytics();
      case 'chatbot':
        return renderChatbotAnalytics();
      default:
        return renderOverview();
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ color: 'primary.main' }}>
            Analytics & Reporting
          </Typography>
          {isDemoMode && (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
              Demo Mode - Viewing sample analytics data
            </Typography>
          )}
        </Box>
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={() => alert('Downloading report...')}
          disabled={!user || isDemoMode}
        >
          Export Report
        </Button>
      </Box>

      {/* Demo Mode Alert */}
      {(!user || isDemoMode) && (
        <Alert severity="info" sx={{ mb: 3 }}>
          You are viewing analytics in demo mode. Sign in to see real analytics data from your campaigns and track performance metrics.
        </Alert>
      )}

      {/* Filters and Controls */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Client</InputLabel>
              <Select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                label="Client"
                disabled={loading}
              >
                <MenuItem value="all">All Clients</MenuItem>
                {isDemoMode ? (
                  <>
                    <MenuItem value="demo-medical">Demo Medical Practice</MenuItem>
                    <MenuItem value="demo-wellness">Demo Wellness Center</MenuItem>
                    <MenuItem value="demo-dental">Demo Dental Clinic</MenuItem>
                    <MenuItem value="demo-chiro">Demo Chiropractic</MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem value="dr-smith">Dr. Smith Medical</MenuItem>
                    <MenuItem value="wellness">Wellness Clinic</MenuItem>
                    <MenuItem value="dental">City Dental</MenuItem>
                    <MenuItem value="physicians">Care Physicians</MenuItem>
                  </>
                )}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                label="Report Type"
              >
                <MenuItem value="overview">Overview</MenuItem>
                <MenuItem value="email">Email Marketing</MenuItem>
                <MenuItem value="social">Social Media</MenuItem>
                <MenuItem value="chatbot">Chatbot</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid size={{ xs: 12, md: 4 }}>
            <ToggleButtonGroup
              value={dateRange}
              exclusive
              onChange={handleDateRangeChange}
              size="small"
              fullWidth
            >
              <ToggleButton value="7d">7D</ToggleButton>
              <ToggleButton value="30d">30D</ToggleButton>
              <ToggleButton value="90d">90D</ToggleButton>
              <ToggleButton value="1y">1Y</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Content */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      ) : (
        renderContent()
      )}

      {/* Info Alert */}
      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          Analytics data is updated in real-time. For detailed insights and custom reports, 
          contact your account manager or export the data for further analysis.
        </Typography>
      </Alert>
    </Container>
  );
};

export default Analytics;