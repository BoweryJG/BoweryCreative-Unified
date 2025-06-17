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
  Tabs,
  Tab,
  TextField,
  Button,
  IconButton,
  Avatar,
  Badge,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Snackbar,
} from '@mui/material';
import {
  Dashboard,
  Person,
  Campaign,
  Analytics as AnalyticsIcon,
  Business,
  Language,
  Instagram,
  Facebook,
  Twitter,
  LinkedIn,
  YouTube,
  Edit,
  Save,
  Cancel,
  Add,
  Delete,
  CheckCircle,
  Schedule,
  AttachMoney,
  ContentPaste,
  RocketLaunch,
  Email,
  Phone,
  LocationOn,
  TrendingUp,
  Visibility,
  ThumbUp,
  Comment,
  Share,
  PhotoCamera,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface ClientProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  website: string;
  socialMedia: {
    instagram: string[];
    facebook: string[];
    twitter: string[];
    linkedin: string[];
    youtube: string[];
  };
  profileImage?: string;
  preferences: {
    marketingGoals: string[];
    targetAudience: string;
    brandVoice: string;
    competitors: string[];
  };
  monthlyBudget: number;
  packageDetails: any;
}

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed' | 'draft';
  type: string;
  startDate: string;
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
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
      id={`client-tabpanel-${index}`}
      aria-labelledby={`client-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ClientMissionControl() {
  const { user, clientData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as any });
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [editedProfile, setEditedProfile] = useState<ClientProfile | null>(null);
  const [addSocialOpen, setAddSocialOpen] = useState(false);
  const [selectedSocial, setSelectedSocial] = useState<keyof ClientProfile['socialMedia']>('instagram');
  const [newSocialAccount, setNewSocialAccount] = useState('');

  // Load client data on mount
  useEffect(() => {
    loadClientData();
  }, [user]);

  const loadClientData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Load profile data
      const { data: profileData, error: profileError } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      // If no profile exists, check onboarding submissions
      if (!profileData) {
        const { data: onboardingData } = await supabase
          .from('onboarding_submissions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (onboardingData) {
          // Create profile from onboarding data
          const formData = onboardingData.form_data;
          const newProfile: Partial<ClientProfile> = {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
            company: formData.practiceName,
            industry: formData.practiceType,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            website: formData.website,
            socialMedia: {
              instagram: formData.instagram ? [formData.instagram] : [],
              facebook: formData.facebook ? [formData.facebook] : [],
              twitter: formData.twitter ? [formData.twitter] : [],
              linkedin: formData.linkedin ? [formData.linkedin] : [],
              youtube: formData.youtube ? [formData.youtube] : [],
            },
            preferences: {
              marketingGoals: formData.marketingGoals || [],
              targetAudience: '',
              brandVoice: '',
              competitors: [],
            },
            monthlyBudget: parseInt(formData.monthlyBudget) || 0,
          };

          // Save to database
          const { data: savedProfile } = await supabase
            .from('client_profiles')
            .insert([{ ...newProfile, user_id: user.id }])
            .select()
            .single();

          setProfile(savedProfile);
        }
      } else {
        setProfile(profileData);
      }

      // Load campaigns
      const { data: campaignsData } = await supabase
        .from('campaigns')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

      if (campaignsData) {
        setCampaigns(campaignsData);
      }

    } catch (error) {
      console.error('Error loading client data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    setEditedProfile(profile);
    setEditMode(true);
  };

  const handleSaveProfile = async () => {
    if (!editedProfile || !user) return;

    try {
      const { error } = await supabase
        .from('client_profiles')
        .update(editedProfile)
        .eq('user_id', user.id);

      if (error) throw error;

      setProfile(editedProfile);
      setEditMode(false);
      setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbar({ open: true, message: 'Error updating profile', severity: 'error' });
    }
  };

  const handleAddSocialAccount = () => {
    if (!editedProfile || !newSocialAccount) return;

    const updated = { ...editedProfile };
    if (!updated.socialMedia[selectedSocial].includes(newSocialAccount)) {
      updated.socialMedia[selectedSocial].push(newSocialAccount);
      setEditedProfile(updated);
    }
    setNewSocialAccount('');
    setAddSocialOpen(false);
  };

  const handleRemoveSocialAccount = (platform: keyof ClientProfile['socialMedia'], account: string) => {
    if (!editedProfile) return;

    const updated = { ...editedProfile };
    updated.socialMedia[platform] = updated.socialMedia[platform].filter(a => a !== account);
    setEditedProfile(updated);
  };

  const renderOverview = () => {
    const totalImpressions = campaigns.reduce((sum, c) => sum + c.metrics.impressions, 0);
    const totalClicks = campaigns.reduce((sum, c) => sum + c.metrics.clicks, 0);
    const totalConversions = campaigns.reduce((sum, c) => sum + c.metrics.conversions, 0);
    const totalSpend = campaigns.reduce((sum, c) => sum + c.metrics.spend, 0);
    const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions * 100).toFixed(2) : '0';

    return (
      <Box>
        {/* Welcome Message */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="h6">Welcome to Your Mission Control</Typography>
          <Typography variant="body2">
            Monitor your campaigns, update your profile, and track your marketing success all in one place.
          </Typography>
        </Alert>

        {/* Stats Overview */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Visibility sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6">Impressions</Typography>
                </Box>
                <Typography variant="h4">{totalImpressions.toLocaleString()}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Total views across all campaigns
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ThumbUp sx={{ color: 'success.main', mr: 1 }} />
                  <Typography variant="h6">Engagement</Typography>
                </Box>
                <Typography variant="h4">{totalClicks.toLocaleString()}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {avgCTR}% average CTR
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUp sx={{ color: 'warning.main', mr: 1 }} />
                  <Typography variant="h6">Conversions</Typography>
                </Box>
                <Typography variant="h4">{totalConversions}</Typography>
                <Typography variant="body2" color="textSecondary">
                  New patients/clients
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AttachMoney sx={{ color: 'info.main', mr: 1 }} />
                  <Typography variant="h6">Ad Spend</Typography>
                </Box>
                <Typography variant="h4">${totalSpend.toLocaleString()}</Typography>
                <Typography variant="body2" color="textSecondary">
                  This month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Active Campaigns */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Active Campaigns</Typography>
          <List>
            {campaigns.filter(c => c.status === 'active').map((campaign) => (
              <ListItem key={campaign.id} divider>
                <ListItemIcon>
                  <Campaign color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={campaign.name}
                  secondary={`${campaign.type} • Started ${new Date(campaign.startDate).toLocaleDateString()}`}
                />
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" color="primary">
                    {campaign.metrics.impressions.toLocaleString()} impressions
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {campaign.metrics.clicks} clicks
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    );
  };

  const renderProfile = () => {
    if (!profile) return null;

    const displayProfile = editMode ? editedProfile : profile;
    if (!displayProfile) return null;

    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">Business Profile</Typography>
          <Box>
            {editMode ? (
              <>
                <Button startIcon={<Save />} variant="contained" onClick={handleSaveProfile} sx={{ mr: 1 }}>
                  Save Changes
                </Button>
                <Button startIcon={<Cancel />} variant="outlined" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button startIcon={<Edit />} variant="outlined" onClick={handleEditProfile}>
                Edit Profile
              </Button>
            )}
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                <Business sx={{ mr: 1, verticalAlign: 'middle' }} />
                Basic Information
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Business Name"
                  value={displayProfile.company}
                  onChange={(e) => editMode && setEditedProfile({ ...displayProfile, company: e.target.value })}
                  disabled={!editMode}
                  fullWidth
                />
                <TextField
                  label="Contact Name"
                  value={displayProfile.name}
                  onChange={(e) => editMode && setEditedProfile({ ...displayProfile, name: e.target.value })}
                  disabled={!editMode}
                  fullWidth
                />
                <TextField
                  label="Email"
                  value={displayProfile.email}
                  onChange={(e) => editMode && setEditedProfile({ ...displayProfile, email: e.target.value })}
                  disabled={!editMode}
                  fullWidth
                />
                <TextField
                  label="Phone"
                  value={displayProfile.phone}
                  onChange={(e) => editMode && setEditedProfile({ ...displayProfile, phone: e.target.value })}
                  disabled={!editMode}
                  fullWidth
                />
                <TextField
                  label="Industry"
                  value={displayProfile.industry}
                  onChange={(e) => editMode && setEditedProfile({ ...displayProfile, industry: e.target.value })}
                  disabled={!editMode}
                  fullWidth
                />
              </Box>
            </Paper>
          </Grid>

          {/* Address Information */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
                Location
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Address"
                  value={displayProfile.address}
                  onChange={(e) => editMode && setEditedProfile({ ...displayProfile, address: e.target.value })}
                  disabled={!editMode}
                  fullWidth
                />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="City"
                    value={displayProfile.city}
                    onChange={(e) => editMode && setEditedProfile({ ...displayProfile, city: e.target.value })}
                    disabled={!editMode}
                    fullWidth
                  />
                  <TextField
                    label="State"
                    value={displayProfile.state}
                    onChange={(e) => editMode && setEditedProfile({ ...displayProfile, state: e.target.value })}
                    disabled={!editMode}
                    sx={{ width: 100 }}
                  />
                  <TextField
                    label="ZIP Code"
                    value={displayProfile.zipCode}
                    onChange={(e) => editMode && setEditedProfile({ ...displayProfile, zipCode: e.target.value })}
                    disabled={!editMode}
                    sx={{ width: 120 }}
                  />
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Digital Presence */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  <Language sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Digital Presence
                </Typography>
                {editMode && (
                  <Button size="small" startIcon={<Add />} onClick={() => setAddSocialOpen(true)}>
                    Add Account
                  </Button>
                )}
              </Box>

              <Box sx={{ mb: 3 }}>
                <TextField
                  label="Website"
                  value={displayProfile.website}
                  onChange={(e) => editMode && setEditedProfile({ ...displayProfile, website: e.target.value })}
                  disabled={!editMode}
                  fullWidth
                  sx={{ mb: 3 }}
                />

                {/* Social Media Accounts */}
                <Grid container spacing={2}>
                  {Object.entries(displayProfile.socialMedia).map(([platform, accounts]) => (
                    <Grid item xs={12} md={6} key={platform}>
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          {platform === 'instagram' && <Instagram sx={{ mr: 1 }} />}
                          {platform === 'facebook' && <Facebook sx={{ mr: 1 }} />}
                          {platform === 'twitter' && <Twitter sx={{ mr: 1 }} />}
                          {platform === 'linkedin' && <LinkedIn sx={{ mr: 1 }} />}
                          {platform === 'youtube' && <YouTube sx={{ mr: 1 }} />}
                          <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                            {platform}
                          </Typography>
                        </Box>
                        {accounts.length > 0 ? (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {accounts.map((account, idx) => (
                              <Chip
                                key={idx}
                                label={account}
                                onDelete={editMode ? () => handleRemoveSocialAccount(platform as keyof ClientProfile['socialMedia'], account) : undefined}
                                size="small"
                              />
                            ))}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            No accounts added
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Paper>
          </Grid>

          {/* Marketing Preferences */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                <Campaign sx={{ mr: 1, verticalAlign: 'middle' }} />
                Marketing Preferences
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Marketing Goals</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {displayProfile.preferences.marketingGoals.map((goal, idx) => (
                      <Chip key={idx} label={goal} color="primary" />
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Target Audience"
                    value={displayProfile.preferences.targetAudience}
                    onChange={(e) => editMode && setEditedProfile({ 
                      ...displayProfile, 
                      preferences: { ...displayProfile.preferences, targetAudience: e.target.value }
                    })}
                    disabled={!editMode}
                    fullWidth
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Brand Voice & Messaging"
                    value={displayProfile.preferences.brandVoice}
                    onChange={(e) => editMode && setEditedProfile({ 
                      ...displayProfile, 
                      preferences: { ...displayProfile.preferences, brandVoice: e.target.value }
                    })}
                    disabled={!editMode}
                    fullWidth
                    multiline
                    rows={3}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderCampaigns = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Your Campaigns</Typography>
        <Chip label={`${campaigns.length} Total Campaigns`} color="primary" />
      </Box>

      <Grid container spacing={3}>
        {campaigns.map((campaign) => (
          <Grid item xs={12} md={6} key={campaign.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6">{campaign.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {campaign.type}
                    </Typography>
                  </Box>
                  <Chip 
                    label={campaign.status} 
                    color={campaign.status === 'active' ? 'success' : 'default'}
                    size="small"
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">Impressions</Typography>
                    <Typography variant="h6">{campaign.metrics.impressions.toLocaleString()}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">Clicks</Typography>
                    <Typography variant="h6">{campaign.metrics.clicks.toLocaleString()}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">Conversions</Typography>
                    <Typography variant="h6">{campaign.metrics.conversions}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">Spend</Typography>
                    <Typography variant="h6">${campaign.metrics.spend}</Typography>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="textSecondary">Performance</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min((campaign.metrics.clicks / campaign.metrics.impressions) * 100, 100)} 
                    sx={{ mt: 1 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  if (loading) {
    return (
      <Container maxWidth={false}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth={false}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mr: 2 }}>
            {profile?.company.charAt(0) || 'C'}
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {profile?.company || 'Mission Control'}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Your complete marketing command center
            </Typography>
          </Box>
        </Box>
      </Box>

      <Tabs value={selectedTab} onChange={(e, v) => setSelectedTab(v)} sx={{ mb: 3 }}>
        <Tab icon={<Dashboard />} label="Overview" />
        <Tab icon={<Person />} label="Profile" />
        <Tab icon={<Campaign />} label="Campaigns" />
        <Tab icon={<AnalyticsIcon />} label="Analytics" />
      </Tabs>

      <TabPanel value={selectedTab} index={0}>
        {renderOverview()}
      </TabPanel>
      <TabPanel value={selectedTab} index={1}>
        {renderProfile()}
      </TabPanel>
      <TabPanel value={selectedTab} index={2}>
        {renderCampaigns()}
      </TabPanel>
      <TabPanel value={selectedTab} index={3}>
        <Alert severity="info">
          Detailed analytics coming soon. Contact your account manager for custom reports.
        </Alert>
      </TabPanel>

      {/* Add Social Account Dialog */}
      <Dialog open={addSocialOpen} onClose={() => setAddSocialOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Social Media Account</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Platform</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {['instagram', 'facebook', 'twitter', 'linkedin', 'youtube'].map((platform) => (
                  <Chip
                    key={platform}
                    label={platform}
                    onClick={() => setSelectedSocial(platform as keyof ClientProfile['socialMedia'])}
                    color={selectedSocial === platform ? 'primary' : 'default'}
                    sx={{ textTransform: 'capitalize' }}
                  />
                ))}
              </Box>
            </FormControl>
            <TextField
              label={`${selectedSocial} Account`}
              value={newSocialAccount}
              onChange={(e) => setNewSocialAccount(e.target.value)}
              fullWidth
              placeholder={selectedSocial === 'instagram' ? '@yourhandle' : 'Account name or URL'}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddSocialOpen(false)}>Cancel</Button>
          <Button onClick={handleAddSocialAccount} variant="contained" disabled={!newSocialAccount}>
            Add Account
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