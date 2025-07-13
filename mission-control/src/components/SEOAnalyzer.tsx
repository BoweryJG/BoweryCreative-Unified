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
  Alert,
  CircularProgress,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Rating,
} from '@mui/material';
import {
  Search,
  LocationOn,
  TrendingUp,
  Warning,
  CheckCircle,
  Error,
  ExpandMore,
  Download,
  Analytics,
} from '@mui/icons-material';

interface CompetitorData {
  name: string;
  address: string;
  rating: number;
  reviews: number;
  distance: string;
  phone: string;
  website: string;
  ranking: number;
  categories: string[];
  strengths: string[];
  weaknesses: string[];
}

interface SEOMetrics {
  score: number;
  title: string;
  value: string | number;
  status: 'good' | 'warning' | 'error';
  recommendation?: string;
}

const SEOAnalyzer: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [clientWebsite, setClientWebsite] = useState('drsmithclinic.com');
  const [location, setLocation] = useState('New York, NY');
  const [keywords, setKeywords] = useState('family doctor, medical clinic, primary care physician');
  
  const [seoMetrics] = useState<SEOMetrics[]>([
    {
      score: 85,
      title: 'Google My Business',
      value: 'Optimized',
      status: 'good',
      recommendation: 'Add more photos and update business hours weekly',
    },
    {
      score: 65,
      title: 'Local Citations',
      value: '45/80 directories',
      status: 'warning',
      recommendation: 'Submit to 35 more local directories for better visibility',
    },
    {
      score: 92,
      title: 'Reviews Score',
      value: '4.8/5 (127 reviews)',
      status: 'good',
      recommendation: 'Maintain review response rate above 90%',
    },
    {
      score: 58,
      title: 'Page Speed',
      value: '3.2s load time',
      status: 'warning',
      recommendation: 'Optimize images and enable caching to improve speed',
    },
    {
      score: 78,
      title: 'Mobile Optimization',
      value: 'Responsive',
      status: 'good',
      recommendation: 'Test booking forms on various mobile devices',
    },
    {
      score: 45,
      title: 'Schema Markup',
      value: 'Partial',
      status: 'error',
      recommendation: 'Add medical business schema and service schema markup',
    },
  ]);

  const [competitors] = useState<CompetitorData[]>([
    {
      name: 'HealthFirst Medical Center',
      address: '123 Main St, New York, NY',
      rating: 4.6,
      reviews: 234,
      distance: '0.5 mi',
      phone: '(555) 234-5678',
      website: 'healthfirstmed.com',
      ranking: 1,
      categories: ['Medical Center', 'Family Practice'],
      strengths: ['Strong review count', 'Active on social media', 'Fast website'],
      weaknesses: ['Limited hours', 'No online booking'],
    },
    {
      name: 'City Care Physicians',
      address: '456 Broadway, New York, NY',
      rating: 4.7,
      reviews: 189,
      distance: '0.8 mi',
      phone: '(555) 345-6789',
      website: 'citycarephysicians.com',
      ranking: 2,
      categories: ['Medical Clinic', 'Internal Medicine'],
      strengths: ['High rating', 'Good website UX', 'Multiple locations'],
      weaknesses: ['Fewer reviews', 'Slow response time'],
    },
    {
      name: 'Premier Family Healthcare',
      address: '789 Park Ave, New York, NY',
      rating: 4.5,
      reviews: 156,
      distance: '1.2 mi',
      phone: '(555) 456-7890',
      website: 'premierfamilyhealth.com',
      ranking: 3,
      categories: ['Family Medicine', 'Pediatrics'],
      strengths: ['Specialized services', 'Modern facility'],
      weaknesses: ['Lower visibility', 'Outdated website'],
    },
  ]);

  const [localKeywords] = useState([
    { keyword: 'family doctor NYC', volume: 2400, difficulty: 68, currentRank: 5 },
    { keyword: 'primary care physician Manhattan', volume: 1800, difficulty: 72, currentRank: 8 },
    { keyword: 'medical clinic near me', volume: 3200, difficulty: 45, currentRank: 12 },
    { keyword: 'doctor appointment NYC', volume: 2800, difficulty: 55, currentRank: 15 },
    { keyword: 'walk in clinic New York', volume: 2100, difficulty: 62, currentRank: 18 },
  ]);

  const generateReport = async () => {
    setAnalyzing(true);
    // Simulate API calls and analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    setAnalyzing(false);
    setReportGenerated(true);
  };

  const downloadReport = () => {
    // In real implementation, this would generate a PDF
    alert('Downloading SEO Report PDF...');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle color="success" />;
      case 'warning':
        return <Warning color="warning" />;
      case 'error':
        return <Error color="error" />;
      default:
        return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success.main';
    if (score >= 60) return 'warning.main';
    return 'error.main';
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', mb: 3 }}>
        SEO & Local Competition Analyzer
      </Typography>

      {/* Analysis Input */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="flex-end">
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              label="Client Website"
              value={clientWebsite}
              onChange={(e) => setClientWebsite(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              variant="outlined"
              InputProps={{
                startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Target Keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              variant="outlined"
              helperText="Comma separated"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={generateReport}
              disabled={analyzing}
              startIcon={analyzing ? <CircularProgress size={20} /> : <Search />}
            >
              {analyzing ? 'Analyzing...' : 'Analyze'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {reportGenerated && (
        <>
          {/* Quick Stats */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Overall SEO Score
                  </Typography>
                  <Typography variant="h3" sx={{ color: 'warning.main' }}>
                    72/100
                  </Typography>
                  <Typography variant="body2">
                    Good, but needs improvement
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Local Ranking
                  </Typography>
                  <Typography variant="h3" sx={{ color: 'info.main' }}>
                    #4
                  </Typography>
                  <Typography variant="body2">
                    In "family doctor NYC"
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Competitors Found
                  </Typography>
                  <Typography variant="h3">
                    12
                  </Typography>
                  <Typography variant="body2">
                    Within 2 mile radius
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Action Items
                  </Typography>
                  <Typography variant="h3" sx={{ color: 'error.main' }}>
                    8
                  </Typography>
                  <Typography variant="body2">
                    High priority fixes
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* SEO Metrics */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">SEO Health Check</Typography>
              <Button startIcon={<Download />} onClick={downloadReport}>
                Download Report
              </Button>
            </Box>
            
            <Grid container spacing={2}>
              {seoMetrics.map((metric, index) => (
                <Grid size={{ xs: 12, md: 6 }} key={index}>
                  <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getStatusIcon(metric.status)}
                        <Typography variant="subtitle1">{metric.title}</Typography>
                      </Box>
                      <Typography variant="h6" sx={{ color: getScoreColor(metric.score) }}>
                        {metric.score}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={metric.score} 
                      sx={{ mb: 1, height: 8, borderRadius: 1 }}
                      color={metric.status === 'good' ? 'success' : metric.status === 'warning' ? 'warning' : 'error'}
                    />
                    <Typography variant="body2" color="textSecondary">
                      Current: {metric.value}
                    </Typography>
                    {metric.recommendation && (
                      <Alert severity="info" sx={{ mt: 1 }}>
                        <Typography variant="caption">{metric.recommendation}</Typography>
                      </Alert>
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Local Competition Analysis */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Local Competition Analysis
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Rank</TableCell>
                    <TableCell>Competitor</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Reviews</TableCell>
                    <TableCell>Distance</TableCell>
                    <TableCell>Strengths</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {competitors.map((competitor) => (
                    <TableRow key={competitor.name}>
                      <TableCell>
                        <Chip label={`#${competitor.ranking}`} size="small" />
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2">{competitor.name}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {competitor.address}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Rating value={competitor.rating} readOnly size="small" precision={0.1} />
                          <Typography variant="body2">{competitor.rating}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{competitor.reviews}</TableCell>
                      <TableCell>{competitor.distance}</TableCell>
                      <TableCell>
                        <Box>
                          {competitor.strengths.slice(0, 2).map((strength, idx) => (
                            <Chip
                              key={idx}
                              label={strength}
                              size="small"
                              color="success"
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <IconButton size="small">
                          <Analytics />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Keyword Opportunities */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Local Keyword Opportunities
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Keyword</TableCell>
                    <TableCell>Monthly Volume</TableCell>
                    <TableCell>Difficulty</TableCell>
                    <TableCell>Current Rank</TableCell>
                    <TableCell>Opportunity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {localKeywords.map((kw, index) => (
                    <TableRow key={index}>
                      <TableCell>{kw.keyword}</TableCell>
                      <TableCell>{kw.volume.toLocaleString()}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={kw.difficulty}
                            sx={{ width: 60, height: 6 }}
                            color={kw.difficulty > 70 ? 'error' : kw.difficulty > 50 ? 'warning' : 'success'}
                          />
                          <Typography variant="caption">{kw.difficulty}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={`#${kw.currentRank}`} 
                          size="small"
                          color={kw.currentRank <= 5 ? 'success' : kw.currentRank <= 10 ? 'warning' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={kw.currentRank > 10 ? 'High' : kw.currentRank > 5 ? 'Medium' : 'Low'}
                          size="small"
                          color={kw.currentRank > 10 ? 'error' : kw.currentRank > 5 ? 'warning' : 'default'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Action Items */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Priority Action Items</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Error color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Add Medical Business Schema Markup"
                    secondary="Implement structured data for medical practices to improve search visibility"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Warning color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Submit to 35 Missing Local Directories"
                    secondary="Increase local citations to match top competitors"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Warning color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Optimize Page Load Speed"
                    secondary="Reduce load time from 3.2s to under 2s by optimizing images"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <TrendingUp color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Target 'medical clinic near me' keyword"
                    secondary="High volume (3,200/mo) with moderate difficulty - good opportunity"
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>
        </>
      )}
    </Container>
  );
};

export default SEOAnalyzer;