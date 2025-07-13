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
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  Business,
  Add,
  Edit,
  Delete,
  Visibility,
  LocationOn,
  Phone,
  Email,
  Web,
  Group,
  AttachMoney,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Practice {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  website?: string;
  contact_person: string;
  specialty?: string;
  size: 'small' | 'medium' | 'large';
  status: 'active' | 'inactive' | 'prospect';
  created_at: string;
  updated_at: string;
}

interface PracticeStats {
  total_practices: number;
  active_practices: number;
  inactive_practices: number;
  prospects: number;
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

const Practices: React.FC = () => {
  const { user } = useAuth();
  const { isDemoMode } = useAppMode();
  const [loading, setLoading] = useState(true);
  const [practices, setPractices] = useState<Practice[]>([]);
  const [stats, setStats] = useState<PracticeStats>({
    total_practices: 0,
    active_practices: 0,
    inactive_practices: 0,
    prospects: 0,
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedPractice, setSelectedPractice] = useState<Practice | null>(null);
  const [formData, setFormData] = useState<Partial<Practice>>({
    name: '',
    type: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    email: '',
    website: '',
    contact_person: '',
    specialty: '',
    size: 'medium',
    status: 'prospect',
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Determine which table to use based on authentication and demo mode
  const tableName = !user || isDemoMode ? 'public_practices' : 'practices';

  useEffect(() => {
    fetchPractices();
  }, [user, isDemoMode]);

  const fetchPractices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPractices(data || []);
      calculateStats(data || []);
    } catch (err) {
      console.error('Error fetching practices:', err);
      setError('Failed to load practices. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (practiceData: Practice[]) => {
    const stats: PracticeStats = {
      total_practices: practiceData.length,
      active_practices: practiceData.filter(p => p.status === 'active').length,
      inactive_practices: practiceData.filter(p => p.status === 'inactive').length,
      prospects: practiceData.filter(p => p.status === 'prospect').length,
    };
    setStats(stats);
  };

  const handleCreate = () => {
    if (!user || isDemoMode) {
      setError('Please sign in to create practices.');
      return;
    }
    setSelectedPractice(null);
    setFormData({
      name: '',
      type: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      phone: '',
      email: '',
      website: '',
      contact_person: '',
      specialty: '',
      size: 'medium',
      status: 'prospect',
    });
    setDialogOpen(true);
  };

  const handleEdit = (practice: Practice) => {
    if (!user || isDemoMode) {
      setError('Please sign in to edit practices.');
      return;
    }
    setSelectedPractice(practice);
    setFormData(practice);
    setDialogOpen(true);
  };

  const handleView = (practice: Practice) => {
    setSelectedPractice(practice);
    setViewDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!user || isDemoMode) {
      setError('Please sign in to delete practices.');
      return;
    }
    
    if (!window.confirm('Are you sure you want to delete this practice?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSuccessMessage('Practice deleted successfully');
      fetchPractices();
    } catch (err) {
      console.error('Error deleting practice:', err);
      setError('Failed to delete practice. Please try again.');
    }
  };

  const handleSave = async () => {
    if (!user || isDemoMode) {
      setError('Please sign in to save practices.');
      return;
    }

    try {
      setError(null);
      
      if (selectedPractice) {
        // Update existing practice
        const { error } = await supabase
          .from(tableName)
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', selectedPractice.id);

        if (error) throw error;
        setSuccessMessage('Practice updated successfully');
      } else {
        // Create new practice
        const { error } = await supabase
          .from(tableName)
          .insert([{
            ...formData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }]);

        if (error) throw error;
        setSuccessMessage('Practice created successfully');
      }

      setDialogOpen(false);
      fetchPractices();
    } catch (err) {
      console.error('Error saving practice:', err);
      setError('Failed to save practice. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'prospect':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getSizeLabel = (size: string) => {
    switch (size) {
      case 'small':
        return '1-5 providers';
      case 'medium':
        return '6-20 providers';
      case 'large':
        return '20+ providers';
      default:
        return size;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: 'primary.main' }}>
          Practice Management
        </Typography>
        {!isDemoMode && user && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreate}
          >
            Add Practice
          </Button>
        )}
      </Box>

      {isDemoMode && (
        <Alert severity="info" sx={{ mb: 3 }}>
          You are viewing demo data. Sign in to manage your own practices.
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Practices
              </Typography>
              <Typography variant="h4">
                {stats.total_practices}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active
              </Typography>
              <Typography variant="h4" sx={{ color: 'success.main' }}>
                {stats.active_practices}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Prospects
              </Typography>
              <Typography variant="h4" sx={{ color: 'warning.main' }}>
                {stats.prospects}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Inactive
              </Typography>
              <Typography variant="h4" sx={{ color: 'error.main' }}>
                {stats.inactive_practices}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Practices Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Practice Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {practices.map((practice) => (
              <TableRow key={practice.id}>
                <TableCell>
                  <Box>
                    <Typography variant="body1">{practice.name}</Typography>
                    {practice.specialty && (
                      <Typography variant="caption" color="textSecondary">
                        {practice.specialty}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>{practice.type}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2">
                      {practice.city}, {practice.state}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">{practice.contact_person}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {practice.phone}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={getSizeLabel(practice.size)}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={practice.status}
                    color={getStatusColor(practice.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="View Details">
                    <IconButton size="small" onClick={() => handleView(practice)}>
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  {!isDemoMode && user && (
                    <>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleEdit(practice)}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => handleDelete(practice.id)}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedPractice ? 'Edit Practice' : 'Add New Practice'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Practice Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Type"
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <MenuItem value="Medical">Medical</MenuItem>
                  <MenuItem value="Dental">Dental</MenuItem>
                  <MenuItem value="Aesthetic">Aesthetic</MenuItem>
                  <MenuItem value="Wellness">Wellness</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="State"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="ZIP Code"
                value={formData.zip}
                onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact Person"
                value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Specialty"
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Size</InputLabel>
                <Select
                  value={formData.size}
                  label="Size"
                  onChange={(e) => setFormData({ ...formData, size: e.target.value as 'small' | 'medium' | 'large' })}
                >
                  <MenuItem value="small">Small (1-5)</MenuItem>
                  <MenuItem value="medium">Medium (6-20)</MenuItem>
                  <MenuItem value="large">Large (20+)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' | 'prospect' })}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="prospect">Prospect</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {selectedPractice ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Practice Details</DialogTitle>
        <DialogContent>
          {selectedPractice && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="h6">{selectedPractice.name}</Typography>
                <Chip 
                  label={selectedPractice.status}
                  color={getStatusColor(selectedPractice.status) as any}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Business fontSize="small" />
                  <Box>
                    <Typography variant="caption" color="textSecondary">Type</Typography>
                    <Typography>{selectedPractice.type}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Group fontSize="small" />
                  <Box>
                    <Typography variant="caption" color="textSecondary">Size</Typography>
                    <Typography>{getSizeLabel(selectedPractice.size)}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <LocationOn fontSize="small" />
                  <Box>
                    <Typography variant="caption" color="textSecondary">Address</Typography>
                    <Typography>{selectedPractice.address}</Typography>
                    <Typography>{selectedPractice.city}, {selectedPractice.state} {selectedPractice.zip}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Phone fontSize="small" />
                  <Box>
                    <Typography variant="caption" color="textSecondary">Phone</Typography>
                    <Typography>{selectedPractice.phone}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Email fontSize="small" />
                  <Box>
                    <Typography variant="caption" color="textSecondary">Email</Typography>
                    <Typography>{selectedPractice.email}</Typography>
                  </Box>
                </Box>
              </Grid>
              {selectedPractice.website && (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Web fontSize="small" />
                    <Box>
                      <Typography variant="caption" color="textSecondary">Website</Typography>
                      <Typography>
                        <a href={selectedPractice.website} target="_blank" rel="noopener noreferrer">
                          {selectedPractice.website}
                        </a>
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="textSecondary">Contact Person</Typography>
                  <Typography>{selectedPractice.contact_person}</Typography>
                </Box>
              </Grid>
              {selectedPractice.specialty && (
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="textSecondary">Specialty</Typography>
                    <Typography>{selectedPractice.specialty}</Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Practices;