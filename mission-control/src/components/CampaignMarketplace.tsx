import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Chip,
  Tab,
  Tabs,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Alert,
  IconButton,
  Tooltip,
  Paper,
  Stack,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  Campaign as CampaignIcon,
  Email as EmailIcon,
  TrendingUp as TrendingIcon,
  Visibility as PreviewIcon,
  ShoppingCart as CartIcon,
  CheckCircle as CheckIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import MenuItem from '@mui/material/MenuItem';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Campaign {
  id: string;
  name: string;
  description: string;
  category: string;
  preview_content: string;
  ai_prompt_template: string;
  base_price: number;
  credits_included: number;
  success_rate: number;
  industry: string;
  use_case: string;
  example_subject_lines: string[];
  example_email_preview: string;
  is_active: boolean;
  specialty_tags?: string[];
  channel_type?: string;
  compliance_approved?: boolean;
  personalization_vars?: Record<string, string>;
  campaign_metrics?: {
    total_purchases: number;
    average_open_rate: number;
    average_response_rate: number;
  };
  campaign_performance_metrics?: any[];
}

const CampaignMarketplace: React.FC = () => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');

  const categories = ['All', 'Healthcare', 'Medical Spa', 'Dental'];
  const specialties = [
    { value: 'dental-implants', label: 'Dental Implants' },
    { value: 'robotic-surgery', label: 'Robotic Surgery' },
    { value: 'injectables', label: 'Injectables' },
    { value: 'botox', label: 'Botox' },
    { value: 'dermal-fillers', label: 'Dermal Fillers' },
    { value: 'coolsculpting', label: 'CoolSculpting' },
    { value: 'microneedling', label: 'Microneedling' },
    { value: 'skin-rejuvenation', label: 'Skin Rejuvenation' },
    { value: 'body-contouring', label: 'Body Contouring' },
    { value: 'membership', label: 'Membership Programs' }
  ];

  useEffect(() => {
    fetchCampaigns();
    if (user) {
      fetchPurchases();
    }
  }, [user]);

  useEffect(() => {
    filterCampaigns();
  }, [campaigns, selectedTab, searchTerm, selectedSpecialty]);

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*, campaign_metrics(*)')
        .eq('is_active', true)
        .order('success_rate', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPurchases = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/purchases`, {
        headers: {
          'x-api-key': import.meta.env.VITE_API_KEY,
          'x-user-id': user?.id || ''
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPurchases(data);
      }
    } catch (error) {
      console.error('Error fetching purchases:', error);
    }
  };

  const filterCampaigns = () => {
    let filtered = [...campaigns];

    // Filter by category
    if (selectedTab > 0) {
      filtered = filtered.filter(c => {
        if (categories[selectedTab] === 'Medical Spa') {
          return c.industry === 'Medical Spa';
        } else if (categories[selectedTab] === 'Dental') {
          return c.industry === 'Dental';
        }
        return c.category === categories[selectedTab];
      });
    }

    // Filter by specialty
    if (selectedSpecialty) {
      filtered = filtered.filter(c => 
        c.specialty_tags?.includes(selectedSpecialty)
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.use_case.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCampaigns(filtered);
  };

  const handlePurchase = async (campaign: Campaign) => {
    if (!user) {
      alert('Please log in to purchase campaigns');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/campaigns/${campaign.id}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_API_KEY,
          'x-user-id': user.id
        },
        body: JSON.stringify({
          clientId: user.user_metadata?.organization_id,
          paymentMethod: 'credit'
        })
      });

      if (response.ok) {
        const purchase = await response.json();
        setPurchases([purchase, ...purchases]);
        setPurchaseOpen(false);
        alert('Campaign purchased successfully! You can now generate emails.');
      } else {
        throw new Error('Purchase failed');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Failed to purchase campaign. Please try again.');
    }
  };

  const isPurchased = (campaignId: string) => {
    return purchases.some(p => p.campaign_id === campaignId && p.credits_used < p.credits_purchased);
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
          Campaign Marketplace
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse proven email campaigns that convert. Each campaign includes AI-powered personalization.
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search campaigns..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
          sx={{ mb: 2 }}
        />
        
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 8 }}>
            <Tabs value={selectedTab} onChange={(_, val) => setSelectedTab(val)}>
              {categories.map((cat, idx) => (
                <Tab key={idx} label={cat} />
              ))}
            </Tabs>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Specialty"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              <MenuItem value="">All Specialties</MenuItem>
              {specialties.map((specialty) => (
                <MenuItem key={specialty.value} value={specialty.value}>
                  {specialty.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Box>

      {/* Campaign Grid */}
      {loading ? (
        <LinearProgress />
      ) : (
        <Grid container spacing={3}>
          {filteredCampaigns.map((campaign) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={campaign.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  position: 'relative',
                  '&:hover': { 
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s'
                  }
                }}
              >
                {isPurchased(campaign.id) && (
                  <Chip
                    label="Purchased"
                    color="success"
                    size="small"
                    icon={<CheckIcon />}
                    sx={{ position: 'absolute', top: 10, right: 10 }}
                  />
                )}
                
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CampaignIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      {campaign.name}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {campaign.description}
                  </Typography>

                  <Stack spacing={1} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CategoryIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="caption">
                        {campaign.category} • {campaign.industry}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TrendingIcon sx={{ fontSize: 16, mr: 1, color: 'success.main' }} />
                      <Typography variant="caption" color="success.main">
                        {campaign.success_rate}% Success Rate
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <EmailIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="caption">
                        {campaign.credits_included} Email Credits
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                        ${campaign.base_price}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ${(campaign.base_price / campaign.credits_included).toFixed(2)} per email
                      </Typography>
                    </Box>
                    
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Preview Campaign">
                        <IconButton 
                          size="small"
                          onClick={() => {
                            setSelectedCampaign(campaign);
                            setPreviewOpen(true);
                          }}
                        >
                          <PreviewIcon />
                        </IconButton>
                      </Tooltip>
                      
                      {!isPurchased(campaign.id) && (
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<CartIcon />}
                          onClick={() => {
                            setSelectedCampaign(campaign);
                            setPurchaseOpen(true);
                          }}
                        >
                          Buy
                        </Button>
                      )}
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CampaignIcon sx={{ mr: 2 }} />
            {selectedCampaign?.name}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedCampaign && (
            <Box>
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Use Case: {selectedCampaign.use_case}
                </Typography>
                <Typography variant="body2">
                  This campaign uses AI to personalize each email based on recipient data.
                </Typography>
              </Alert>

              <Typography variant="h6" sx={{ mb: 2 }}>
                Example Subject Lines:
              </Typography>
              <Stack spacing={1} sx={{ mb: 3 }}>
                {selectedCampaign.example_subject_lines?.map((subject, idx) => (
                  <Paper key={idx} sx={{ p: 1.5, bgcolor: 'grey.100' }}>
                    <Typography variant="body2">{subject}</Typography>
                  </Paper>
                ))}
              </Stack>

              <Typography variant="h6" sx={{ mb: 2 }}>
                Email Preview:
              </Typography>
              <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {selectedCampaign.example_email_preview}
                </Typography>
              </Paper>

              {selectedCampaign.campaign_metrics && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Performance Metrics:
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={4}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4" color="primary">
                          {selectedCampaign.campaign_metrics.total_purchases}
                        </Typography>
                        <Typography variant="caption">
                          Total Purchases
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid size={4}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4" color="primary">
                          {selectedCampaign.campaign_metrics.average_open_rate}%
                        </Typography>
                        <Typography variant="caption">
                          Avg Open Rate
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid size={4}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4" color="primary">
                          {selectedCampaign.campaign_metrics.average_response_rate}%
                        </Typography>
                        <Typography variant="caption">
                          Avg Response Rate
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
          {selectedCampaign && !isPurchased(selectedCampaign.id) && (
            <Button 
              variant="contained" 
              startIcon={<CartIcon />}
              onClick={() => {
                setPreviewOpen(false);
                setPurchaseOpen(true);
              }}
            >
              Purchase Campaign
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Purchase Dialog */}
      <Dialog open={purchaseOpen} onClose={() => setPurchaseOpen(false)}>
        <DialogTitle>Purchase Campaign</DialogTitle>
        <DialogContent>
          {selectedCampaign && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {selectedCampaign.name}
              </Typography>
              
              <Alert severity="success" sx={{ mb: 3 }}>
                <Typography variant="subtitle2">
                  You'll receive {selectedCampaign.credits_included} email credits
                </Typography>
                <Typography variant="body2">
                  Each credit allows you to generate one personalized email with AI
                </Typography>
              </Alert>

              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                  ${selectedCampaign.base_price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  One-time payment
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                • Credits valid for 90 days<br />
                • AI-powered personalization<br />
                • Mailto links for easy sending<br />
                • Track which emails were sent
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPurchaseOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => selectedCampaign && handlePurchase(selectedCampaign)}
          >
            Complete Purchase
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CampaignMarketplace;