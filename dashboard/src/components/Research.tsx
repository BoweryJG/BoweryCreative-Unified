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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Science,
  Add,
  Edit,
  Delete,
  Visibility,
  Article,
  DateRange,
  Category,
  Description,
  FileDownload,
  Link as LinkIcon,
  Search,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface ResearchProject {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'active' | 'completed' | 'archived';
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

interface ResearchDocument {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  document_type: string;
  file_url?: string;
  external_url?: string;
  created_at: string;
  updated_at: string;
}

interface ResearchStats {
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  total_documents: number;
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

const Research: React.FC = () => {
  const { user } = useAuth();
  const { isDemoMode } = useAppMode();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [documents, setDocuments] = useState<ResearchDocument[]>([]);
  const [stats, setStats] = useState<ResearchStats>({
    total_projects: 0,
    active_projects: 0,
    completed_projects: 0,
    total_documents: 0,
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ResearchProject | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<ResearchDocument[]>([]);
  const [formData, setFormData] = useState<Partial<ResearchProject>>({
    title: '',
    description: '',
    category: '',
    status: 'active',
    start_date: new Date().toISOString().split('T')[0],
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Determine which tables to use based on authentication and demo mode
  const projectsTable = !user || isDemoMode ? 'public_research_projects' : 'research_projects';
  const documentsTable = !user || isDemoMode ? 'public_research_documents' : 'research_documents';

  useEffect(() => {
    fetchResearchData();
  }, [user, isDemoMode]);

  const fetchResearchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from(projectsTable)
        .select('*')
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      // Fetch documents
      const { data: documentsData, error: documentsError } = await supabase
        .from(documentsTable)
        .select('*')
        .order('created_at', { ascending: false });

      if (documentsError) throw documentsError;

      setProjects(projectsData || []);
      setDocuments(documentsData || []);
      calculateStats(projectsData || [], documentsData || []);
    } catch (err) {
      console.error('Error fetching research data:', err);
      setError('Failed to load research data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (projectsData: ResearchProject[], documentsData: ResearchDocument[]) => {
    const stats: ResearchStats = {
      total_projects: projectsData.length,
      active_projects: projectsData.filter(p => p.status === 'active').length,
      completed_projects: projectsData.filter(p => p.status === 'completed').length,
      total_documents: documentsData.length,
    };
    setStats(stats);
  };

  const handleCreate = () => {
    if (!user || isDemoMode) {
      setError('Please sign in to create research projects.');
      return;
    }
    setSelectedProject(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      status: 'active',
      start_date: new Date().toISOString().split('T')[0],
    });
    setDialogOpen(true);
  };

  const handleEdit = (project: ResearchProject) => {
    if (!user || isDemoMode) {
      setError('Please sign in to edit research projects.');
      return;
    }
    setSelectedProject(project);
    setFormData({
      ...project,
      start_date: project.start_date.split('T')[0],
      end_date: project.end_date ? project.end_date.split('T')[0] : undefined,
    });
    setDialogOpen(true);
  };

  const handleView = (project: ResearchProject) => {
    setSelectedProject(project);
    const projectDocs = documents.filter(doc => doc.project_id === project.id);
    setSelectedDocuments(projectDocs);
    setViewDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!user || isDemoMode) {
      setError('Please sign in to delete research projects.');
      return;
    }
    
    if (!window.confirm('Are you sure you want to delete this research project?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from(projectsTable)
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSuccessMessage('Research project deleted successfully');
      fetchResearchData();
    } catch (err) {
      console.error('Error deleting research project:', err);
      setError('Failed to delete research project. Please try again.');
    }
  };

  const handleSave = async () => {
    if (!user || isDemoMode) {
      setError('Please sign in to save research projects.');
      return;
    }

    try {
      setError(null);
      
      if (selectedProject) {
        // Update existing project
        const { error } = await supabase
          .from(projectsTable)
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', selectedProject.id);

        if (error) throw error;
        setSuccessMessage('Research project updated successfully');
      } else {
        // Create new project
        const { error } = await supabase
          .from(projectsTable)
          .insert([{
            ...formData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }]);

        if (error) throw error;
        setSuccessMessage('Research project created successfully');
      }

      setDialogOpen(false);
      fetchResearchData();
    } catch (err) {
      console.error('Error saving research project:', err);
      setError('Failed to save research project. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'primary';
      case 'completed':
        return 'success';
      case 'archived':
        return 'default';
      default:
        return 'default';
    }
  };

  const categories = ['Medical Research', 'Clinical Trials', 'Patient Studies', 'Healthcare Innovation', 'Technology', 'Other'];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', mb: 3 }}>
        Research Projects
      </Typography>

      {/* Demo Mode Alert */}
      {(!user || isDemoMode) && (
        <Alert severity="info" sx={{ mb: 3 }}>
          You are viewing research projects in demo mode. Sign in to create and manage your own research projects.
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Science sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6">Total Projects</Typography>
              </Box>
              <Typography variant="h4">{stats.total_projects}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DateRange sx={{ mr: 2, color: 'info.main' }} />
                <Typography variant="h6">Active</Typography>
              </Box>
              <Typography variant="h4">{stats.active_projects}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Category sx={{ mr: 2, color: 'success.main' }} />
                <Typography variant="h6">Completed</Typography>
              </Box>
              <Typography variant="h4">{stats.completed_projects}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Article sx={{ mr: 2, color: 'warning.main' }} />
                <Typography variant="h6">Documents</Typography>
              </Box>
              <Typography variant="h4">{stats.total_documents}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Actions and Filters */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreate}
          disabled={!user || isDemoMode}
        >
          New Research Project
        </Button>
        <TextField
          size="small"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ flexGrow: 1, maxWidth: 300 }}
        />
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            label="Category"
          >
            <MenuItem value="all">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Success/Error Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      )}

      {/* Projects Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Documents</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProjects.map((project) => {
              const projectDocs = documents.filter(doc => doc.project_id === project.id);
              return (
                <TableRow key={project.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {project.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {project.description.substring(0, 100)}...
                    </Typography>
                  </TableCell>
                  <TableCell>{project.category}</TableCell>
                  <TableCell>
                    <Chip
                      label={project.status}
                      color={getStatusColor(project.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{new Date(project.start_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {project.end_date ? new Date(project.end_date).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>{projectDocs.length}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton size="small" onClick={() => handleView(project)}>
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(project)}
                        disabled={!user || isDemoMode}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(project.id)}
                        disabled={!user || isDemoMode}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedProject ? 'Edit Research Project' : 'New Research Project'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={4}
              required
            />
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                label="Status"
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={formData.end_date || ''}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {selectedProject ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Science sx={{ mr: 2 }} />
            {selectedProject?.title}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedProject && (
            <Box>
              <Typography variant="body1" paragraph>
                {selectedProject.description}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Chip label={selectedProject.category} icon={<Category />} />
                <Chip
                  label={selectedProject.status}
                  color={getStatusColor(selectedProject.status)}
                />
                <Chip
                  label={`Started: ${new Date(selectedProject.start_date).toLocaleDateString()}`}
                  icon={<DateRange />}
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Related Documents ({selectedDocuments.length})
              </Typography>

              {selectedDocuments.length > 0 ? (
                <List>
                  {selectedDocuments.map((doc) => (
                    <ListItem key={doc.id}>
                      <ListItemIcon>
                        <Article />
                      </ListItemIcon>
                      <ListItemText
                        primary={doc.title}
                        secondary={doc.description}
                      />
                      {doc.file_url && (
                        <IconButton>
                          <FileDownload />
                        </IconButton>
                      )}
                      {doc.external_url && (
                        <IconButton>
                          <LinkIcon />
                        </IconButton>
                      )}
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No documents available for this project.
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Research;