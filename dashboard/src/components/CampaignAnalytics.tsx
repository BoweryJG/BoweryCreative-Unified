import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
  Paper,
  Stack,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button
} from '@mui/material';
import {
  Email,
  TouchApp,
  ShoppingCart,
  AttachMoney,
  Refresh,
  Download,
  Visibility
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';

interface CampaignAnalyticsProps {
  campaignId: string;
  campaignName: string;
}

interface PerformanceMetrics {
  totals: {
    emails_sent: number;
    emails_opened: number;
    links_clicked: number;
    conversions: number;
    revenue_generated: number;
  };
  averages: {
    open_rate: string;
    click_rate: string;
    conversion_rate: string;
  };
  daily_metrics: Array<{
    metric_date: string;
    emails_sent: number;
    emails_opened: number;
    links_clicked: number;
    conversions: number;
    revenue_generated: number;
  }>;
}

const CampaignAnalytics: React.FC<CampaignAnalyticsProps> = ({ campaignId, campaignName }) => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [campaignId, dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      
      switch (dateRange) {
        case '7d':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(startDate.getDate() - 90);
          break;
        case 'all':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/campaigns/${campaignId}/analytics?` +
        `start_date=${startDate.toISOString().split('T')[0]}&` +
        `end_date=${endDate.toISOString().split('T')[0]}`,
        {
          headers: {
            'x-api-key': import.meta.env.VITE_API_KEY,
            'x-user-id': user?.id || ''
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAnalytics();
  };

  const handleExport = () => {
    if (!metrics) return;

    const csv = [
      ['Date', 'Emails Sent', 'Emails Opened', 'Links Clicked', 'Conversions', 'Revenue'],
      ...metrics.daily_metrics.map(m => [
        m.metric_date,
        m.emails_sent,
        m.emails_opened,
        m.links_clicked,
        m.conversions,
        m.revenue_generated
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${campaignName}-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  const performanceData = metrics ? [
    { name: 'Sent', value: metrics.totals.emails_sent, color: COLORS[0] },
    { name: 'Opened', value: metrics.totals.emails_opened, color: COLORS[1] },
    { name: 'Clicked', value: metrics.totals.links_clicked, color: COLORS[2] },
    { name: 'Converted', value: metrics.totals.conversions, color: COLORS[3] }
  ] : [];

  if (loading && !refreshing) {
    return <LinearProgress />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Campaign Analytics: {campaignName}
        </Typography>
        
        <Stack direction="row" spacing={2}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Date Range</InputLabel>
            <Select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              label="Date Range"
            >
              <MenuItem value="7d">Last 7 days</MenuItem>
              <MenuItem value="30d">Last 30 days</MenuItem>
              <MenuItem value="90d">Last 90 days</MenuItem>
              <MenuItem value="all">All time</MenuItem>
            </Select>
          </FormControl>
          
          <Tooltip title="Refresh data">
            <IconButton onClick={handleRefresh} disabled={refreshing}>
              <Refresh />
            </IconButton>
          </Tooltip>
          
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExport}
            disabled={!metrics}
          >
            Export
          </Button>
        </Stack>
      </Box>

      {metrics && (
        <>
          {/* Metric Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Email sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography color="textSecondary" variant="body2">
                      Emails Sent
                    </Typography>
                  </Box>
                  <Typography variant="h4">{metrics.totals.emails_sent.toLocaleString()}</Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Visibility sx={{ mr: 1, color: 'info.main' }} />
                    <Typography color="textSecondary" variant="body2">
                      Open Rate
                    </Typography>
                  </Box>
                  <Typography variant="h4">{metrics.averages.open_rate}%</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {metrics.totals.emails_opened.toLocaleString()} opened
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <TouchApp sx={{ mr: 1, color: 'success.main' }} />
                    <Typography color="textSecondary" variant="body2">
                      Click Rate
                    </Typography>
                  </Box>
                  <Typography variant="h4">{metrics.averages.click_rate}%</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {metrics.totals.links_clicked.toLocaleString()} clicks
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ShoppingCart sx={{ mr: 1, color: 'warning.main' }} />
                    <Typography color="textSecondary" variant="body2">
                      Conversion Rate
                    </Typography>
                  </Box>
                  <Typography variant="h4">{metrics.averages.conversion_rate}%</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {metrics.totals.conversions.toLocaleString()} conversions
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AttachMoney sx={{ mr: 1, color: 'success.main' }} />
                    <Typography color="textSecondary" variant="body2">
                      Revenue
                    </Typography>
                  </Box>
                  <Typography variant="h4">
                    ${metrics.totals.revenue_generated.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ${(metrics.totals.revenue_generated / metrics.totals.conversions || 0).toFixed(0)} avg
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={3}>
            {/* Performance Trend */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Performance Trend
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={metrics.daily_metrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="metric_date" />
                    <YAxis />
                    <ChartTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="emails_sent" stroke={COLORS[0]} name="Sent" />
                    <Line type="monotone" dataKey="emails_opened" stroke={COLORS[1]} name="Opened" />
                    <Line type="monotone" dataKey="links_clicked" stroke={COLORS[2]} name="Clicked" />
                    <Line type="monotone" dataKey="conversions" stroke={COLORS[3]} name="Conversions" />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Funnel Chart */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Email Funnel
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart layout="horizontal" data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <ChartTooltip />
                    <Bar dataKey="value">
                      {performanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Revenue by Day */}
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Daily Revenue
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={metrics.daily_metrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="metric_date" />
                    <YAxis />
                    <ChartTooltip formatter={(value: any) => `$${value}`} />
                    <Bar dataKey="revenue_generated" fill={COLORS[4]} />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default CampaignAnalytics;