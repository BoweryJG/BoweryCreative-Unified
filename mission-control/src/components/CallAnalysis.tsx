import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
} from '@mui/material';
import {
  Phone,
  Add,
  Edit,
  Delete,
  Visibility,
  TrendingUp,
  TrendingDown,
  Assessment,
  Timer,
  CheckCircle,
  Warning,
  Info,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface CallRecord {
  id: string;
  client_name: string;
  phone_number: string;
  duration: number;
  status: 'completed' | 'missed' | 'voicemail' | 'failed';
  outcome: string;
  notes?: string;
  recording_url?: string;
  created_at: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  follow_up_required: boolean;
}

interface CallStats {
  total_calls: number;
  completed_calls: number;
  missed_calls: number;
  average_duration: number;
  total_duration: number;
  conversion_rate: number;
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

const CallAnalysis: React.FC = () => {
  const { user } = useAuth();
  const { isDemoMode } = useAppMode();
  const [loading, setLoading] = useState(true);
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [stats, setStats] = useState<CallStats>({
    total_calls: 0,
    completed_calls: 0,
    missed_calls: 0,
    average_duration: 0,
    total_duration: 0,
    conversion_rate: 0,
  });
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPeriod, setFilterPeriod] = useState<string>('7days');

  useEffect(() => {
    if (user || isDemoMode) {
      fetchCallData();
    }
  }, [user, isDemoMode, filterStatus, filterPeriod]);

  const fetchCallData = async () => {
    try {
      setLoading(true);
      
      // Determine which table to use based on authentication and demo mode
      const tableName = !user || isDemoMode ? 'public_call_analysis' : 'call_analysis';
      
      // Build query
      let query = supabase.from(tableName).select('*');
      
      // Apply user filter only for authenticated non-demo users
      if (user && !isDemoMode) {
        query = query.eq('user_id', user.id);
      }
      
      // Apply status filter
      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }
      
      // Apply period filter
      const periodDays = {
        '7days': 7,
        '30days': 30,
        '90days': 90,
        'all': null,
      }[filterPeriod];
      
      if (periodDays) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - periodDays);
        query = query.gte('created_at', startDate.toISOString());
      }
      
      // Order by date
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setCalls(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error fetching call data:', error);
      // In demo mode, show sample data if fetch fails
      if (isDemoMode) {
        const sampleData = generateSampleCallData();
        setCalls(sampleData);
        calculateStats(sampleData);
      }
    } finally {
      setLoading(false);
    }
  };

  const generateSampleCallData = (): CallRecord[] => {
    return [
      {
        id: '1',
        client_name: 'John Smith',
        phone_number: '+1 (555) 123-4567',
        duration: 245,
        status: 'completed',
        outcome: 'Scheduled appointment',
        notes: 'Interested in teeth whitening service',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        sentiment: 'positive',
        follow_up_required: false,
      },
      {
        id: '2',
        client_name: 'Sarah Johnson',
        phone_number: '+1 (555) 987-6543',
        duration: 0,
        status: 'missed',
        outcome: 'No answer',
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        sentiment: 'neutral',
        follow_up_required: true,
      },
      {
        id: '3',
        client_name: 'Michael Brown',
        phone_number: '+1 (555) 456-7890',
        duration: 180,
        status: 'voicemail',
        outcome: 'Left voicemail about special offer',
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        sentiment: 'neutral',
        follow_up_required: true,
      },
      {
        id: '4',
        client_name: 'Emily Davis',
        phone_number: '+1 (555) 234-5678',
        duration: 420,
        status: 'completed',
        outcome: 'Purchased treatment package',
        notes: 'Very satisfied with consultation',
        created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        sentiment: 'positive',
        follow_up_required: false,
      },
    ];
  };

  const calculateStats = (callData: CallRecord[]) => {
    const completed = callData.filter(c => c.status === 'completed');
    const totalDuration = callData.reduce((sum, call) => sum + call.duration, 0);
    const conversions = callData.filter(c => 
      c.outcome.toLowerCase().includes('scheduled') || 
      c.outcome.toLowerCase().includes('purchased')
    );

    setStats({
      total_calls: callData.length,
      completed_calls: completed.length,
      missed_calls: callData.filter(c => c.status === 'missed').length,
      average_duration: completed.length > 0 ? totalDuration / completed.length : 0,
      total_duration: totalDuration,
      conversion_rate: callData.length > 0 ? (conversions.length / callData.length) * 100 : 0,
    });
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string): "success" | "warning" | "error" | "default" => {
    switch (status) {
      case 'completed': return 'success';
      case 'missed': return 'error';
      case 'voicemail': return 'warning';
      default: return 'default';
    }
  };

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp color="success" />;
      case 'negative': return <TrendingDown color="error" />;
      default: return <Assessment color="action" />;
    }
  };

  const handleViewCall = (call: CallRecord) => {
    setSelectedCall(call);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', mb: 3 }}>
        Call Analysis
      </Typography>

      {isDemoMode && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <strong>Demo Mode:</strong> You're viewing sample call data. Sign in to see your actual call analytics.
        </Alert>
      )}

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Phone sx={{ color: 'primary.main' }} />
                <Typography variant="h5">{stats.total_calls}</Typography>
              </Box>
              <Typography color="textSecondary" variant="body2" sx={{ mt: 1 }}>
                Total Calls
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {filterPeriod === 'all' ? 'All time' : `Last ${filterPeriod}`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <CheckCircle sx={{ color: 'success.main' }} />
                <Typography variant="h5">{stats.completed_calls}</Typography>
              </Box>
              <Typography color="textSecondary" variant="body2" sx={{ mt: 1 }}>
                Completed Calls
              </Typography>
              <Typography variant="caption" color="success.main">
                {stats.total_calls > 0 ? `${Math.round((stats.completed_calls / stats.total_calls) * 100)}% success rate` : '0% success rate'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Timer sx={{ color: 'info.main' }} />
                <Typography variant="h5">{formatDuration(Math.round(stats.average_duration))}</Typography>
              </Box>
              <Typography color="textSecondary" variant="body2" sx={{ mt: 1 }}>
                Average Duration
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Per completed call
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <TrendingUp sx={{ color: 'warning.main' }} />
                <Typography variant="h5">{Math.round(stats.conversion_rate)}%</Typography>
              </Box>
              <Typography color="textSecondary" variant="body2" sx={{ mt: 1 }}>
                Conversion Rate
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Appointments/Sales
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Actions */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 4, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="all">All Calls</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="missed">Missed</MenuItem>
                <MenuItem value="voicemail">Voicemail</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Period</InputLabel>
              <Select
                value={filterPeriod}
                label="Period"
                onChange={(e) => setFilterPeriod(e.target.value)}
              >
                <MenuItem value="7days">Last 7 Days</MenuItem>
                <MenuItem value="30days">Last 30 Days</MenuItem>
                <MenuItem value="90days">Last 90 Days</MenuItem>
                <MenuItem value="all">All Time</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4, md: 6 }} sx={{ textAlign: 'right' }}>
            {!isDemoMode && user && (
              <Button
                variant="contained"
                startIcon={<Add />}
                disabled={isDemoMode}
              >
                Log Call
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Call Records Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Client</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Outcome</TableCell>
              <TableCell>Sentiment</TableCell>
              <TableCell>Date/Time</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {calls.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography color="textSecondary" sx={{ py: 3 }}>
                    No call records found for the selected filters
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              calls.map((call) => (
                <TableRow key={call.id}>
                  <TableCell>
                    <Typography variant="body2">{call.client_name}</Typography>
                    {call.follow_up_required && (
                      <Chip label="Follow-up" size="small" color="warning" sx={{ mt: 0.5 }} />
                    )}
                  </TableCell>
                  <TableCell>{call.phone_number}</TableCell>
                  <TableCell>
                    <Chip
                      label={call.status}
                      size="small"
                      color={getStatusColor(call.status)}
                    />
                  </TableCell>
                  <TableCell>{formatDuration(call.duration)}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 200 }} noWrap>
                      {call.outcome}
                    </Typography>
                  </TableCell>
                  <TableCell>{getSentimentIcon(call.sentiment)}</TableCell>
                  <TableCell>
                    {new Date(call.created_at).toLocaleDateString()}<br />
                    <Typography variant="caption" color="textSecondary">
                      {new Date(call.created_at).toLocaleTimeString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton size="small" onClick={() => handleViewCall(call)}>
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    {!isDemoMode && user && (
                      <>
                        <Tooltip title="Edit">
                          <IconButton size="small" disabled={isDemoMode}>
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" disabled={isDemoMode}>
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Call Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Call Details</DialogTitle>
        <DialogContent>
          {selectedCall && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="textSecondary">Client Name</Typography>
                  <Typography variant="body1">{selectedCall.client_name}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="textSecondary">Phone Number</Typography>
                  <Typography variant="body1">{selectedCall.phone_number}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="textSecondary">Status</Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={selectedCall.status}
                      size="small"
                      color={getStatusColor(selectedCall.status)}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="textSecondary">Duration</Typography>
                  <Typography variant="body1">{formatDuration(selectedCall.duration)}</Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption" color="textSecondary">Outcome</Typography>
                  <Typography variant="body1">{selectedCall.outcome}</Typography>
                </Grid>
                {selectedCall.notes && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="caption" color="textSecondary">Notes</Typography>
                    <Typography variant="body1">{selectedCall.notes}</Typography>
                  </Grid>
                )}
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="textSecondary">Sentiment</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    {getSentimentIcon(selectedCall.sentiment)}
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {selectedCall.sentiment || 'Not analyzed'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="textSecondary">Follow-up Required</Typography>
                  <Typography variant="body1">
                    {selectedCall.follow_up_required ? 'Yes' : 'No'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption" color="textSecondary">Date & Time</Typography>
                  <Typography variant="body1">
                    {new Date(selectedCall.created_at).toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
          {!isDemoMode && user && selectedCall?.recording_url && (
            <Button variant="contained" startIcon={<Phone />}>
              Play Recording
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CallAnalysis;