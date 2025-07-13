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
  CardMedia,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Chip,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Badge,
} from '@mui/material';
import {
  Facebook,
  Instagram,
  LinkedIn,
  Twitter,
  Schedule as ScheduleIcon,
  Add,
  Edit,
  Delete,
  Preview,
  Analytics as AnalyticsIcon,
  Image as ImageIcon,
  CalendarMonth,
  Send,
  Pending,
  CheckCircle,
  Error as ErrorIcon,
  TrendingUp,
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
      id={`social-tabpanel-${index}`}
      aria-labelledby={`social-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

interface SocialPost {
  id: string;
  content: string;
  platforms: string[];
  media?: string;
  mediaType?: 'image' | 'video';
  scheduledDate?: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
    impressions: number;
  };
}

interface SocialAccount {
  id: string;
  platform: string;
  name: string;
  username: string;
  avatar?: string;
  followers: number;
  isConnected: boolean;
}

const SocialMedia: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [postContent, setPostContent] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  
  const [posts] = useState<SocialPost[]>([
    {
      id: '1',
      content: 'Exciting news! We are now offering telehealth consultations. Book your appointment today and get the care you need from the comfort of your home. 🏥💻 #Telehealth #Healthcare #ConvenientCare',
      platforms: ['facebook', 'instagram', 'linkedin'],
      media: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400',
      mediaType: 'image',
      scheduledDate: '2025-06-15T14:00:00',
      status: 'scheduled',
    },
    {
      id: '2',
      content: 'Did you know? Regular check-ups can prevent 80% of chronic diseases. Schedule your annual wellness exam today! #PreventiveCare #HealthTips',
      platforms: ['twitter', 'facebook'],
      scheduledDate: '2025-06-14T10:00:00',
      status: 'scheduled',
    },
    {
      id: '3',
      content: 'Happy to announce Dr. Sarah Johnson has joined our team! She specializes in family medicine and pediatric care. Welcome, Dr. Johnson! 👩‍⚕️',
      platforms: ['facebook', 'instagram', 'linkedin', 'twitter'],
      media: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
      mediaType: 'image',
      status: 'published',
      engagement: {
        likes: 245,
        comments: 32,
        shares: 18,
        impressions: 3420,
      },
    },
  ]);

  const [accounts] = useState<SocialAccount[]>([
    {
      id: '1',
      platform: 'facebook',
      name: 'Dr. Smith Medical Clinic',
      username: '@drsmithclinic',
      avatar: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=100',
      followers: 2340,
      isConnected: true,
    },
    {
      id: '2',
      platform: 'instagram',
      name: 'Dr. Smith Clinic',
      username: '@drsmithclinic',
      followers: 1856,
      isConnected: true,
    },
    {
      id: '3',
      platform: 'linkedin',
      name: 'Dr. Smith Medical Practice',
      username: 'dr-smith-medical',
      followers: 892,
      isConnected: true,
    },
    {
      id: '4',
      platform: 'twitter',
      name: 'Dr. Smith Clinic',
      username: '@DrSmithClinic',
      followers: 567,
      isConnected: false,
    },
  ]);

  const [analytics] = useState({
    totalPosts: 156,
    totalEngagement: 12450,
    avgEngagementRate: 4.2,
    topPlatform: 'Facebook',
    growth: {
      followers: '+235',
      engagement: '+18%',
    },
  });

  const platformIcons: Record<string, React.ReactNode> = {
    facebook: <Facebook />,
    instagram: <Instagram />,
    linkedin: <LinkedIn />,
    twitter: <Twitter />,
  };

  const platformColors: Record<string, string> = {
    facebook: '#1877f2',
    instagram: '#E4405F',
    linkedin: '#0077b5',
    twitter: '#1DA1F2',
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreatePost = () => {
    // In real implementation, this would save to backend
    console.log('Creating post:', { content: postContent, platforms: selectedPlatforms, scheduledDate });
    setCreateDialogOpen(false);
    setPostContent('');
    setSelectedPlatforms([]);
    setScheduledDate('');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle color="success" />;
      case 'scheduled':
        return <ScheduleIcon color="warning" />;
      case 'draft':
        return <Pending color="info" />;
      case 'failed':
        return <ErrorIcon color="error" />;
      default:
        return null;
    }
  };

  const renderPostsContent = () => (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Social Media Posts</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Create Post
        </Button>
      </Box>

      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={post.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {post.media && (
                <CardMedia
                  component="img"
                  height="200"
                  image={post.media}
                  alt="Post media"
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {getStatusIcon(post.status)}
                  <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                    {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                  </Typography>
                </Box>
                
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {post.content.length > 150 
                    ? `${post.content.substring(0, 150)}...` 
                    : post.content}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  {post.platforms.map((platform) => (
                    <Avatar
                      key={platform}
                      sx={{
                        width: 24,
                        height: 24,
                        bgcolor: platformColors[platform],
                      }}
                    >
                      <Box sx={{ fontSize: 16 }}>
                        {platformIcons[platform]}
                      </Box>
                    </Avatar>
                  ))}
                </Box>

                {post.scheduledDate && (
                  <Typography variant="caption" color="text.secondary">
                    {new Date(post.scheduledDate).toLocaleString()}
                  </Typography>
                )}

                {post.engagement && (
                  <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Grid container spacing={1}>
                      <Grid size={3}>
                        <Typography variant="caption" display="block" color="text.secondary">
                          Likes
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {post.engagement.likes}
                        </Typography>
                      </Grid>
                      <Grid size={3}>
                        <Typography variant="caption" display="block" color="text.secondary">
                          Comments
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {post.engagement.comments}
                        </Typography>
                      </Grid>
                      <Grid size={3}>
                        <Typography variant="caption" display="block" color="text.secondary">
                          Shares
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {post.engagement.shares}
                        </Typography>
                      </Grid>
                      <Grid size={3}>
                        <Typography variant="caption" display="block" color="text.secondary">
                          Reach
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {post.engagement.impressions}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </CardContent>
              <Box sx={{ p: 2, pt: 0 }}>
                <IconButton size="small">
                  <Preview />
                </IconButton>
                <IconButton size="small">
                  <Edit />
                </IconButton>
                <IconButton size="small">
                  <Delete />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );

  const renderAccountsContent = () => (
    <>
      <Typography variant="h6" gutterBottom>
        Connected Accounts
      </Typography>

      <Grid container spacing={3}>
        {accounts.map((account) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={account.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: platformColors[account.platform],
                      width: 48,
                      height: 48,
                    }}
                  >
                    {platformIcons[account.platform]}
                  </Avatar>
                  <Box sx={{ ml: 2, flexGrow: 1 }}>
                    <Typography variant="body1" fontWeight="bold">
                      {account.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {account.username}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Followers
                    </Typography>
                    <Typography variant="h6">
                      {account.followers.toLocaleString()}
                    </Typography>
                  </Box>
                  <Chip
                    label={account.isConnected ? 'Connected' : 'Disconnected'}
                    color={account.isConnected ? 'success' : 'default'}
                    size="small"
                  />
                </Box>

                <Button
                  fullWidth
                  variant={account.isConnected ? 'outlined' : 'contained'}
                  size="small"
                >
                  {account.isConnected ? 'Manage' : 'Connect'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );

  const renderCalendarContent = () => (
    <>
      <Typography variant="h6" gutterBottom>
        Content Calendar
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Alert severity="info">
          Interactive calendar view coming soon. Posts are automatically scheduled based on optimal engagement times for each platform.
        </Alert>
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Upcoming Posts
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Content</TableCell>
                  <TableCell>Platforms</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {posts
                  .filter(post => post.status === 'scheduled')
                  .map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        {new Date(post.scheduledDate!).toLocaleString()}
                      </TableCell>
                      <TableCell sx={{ maxWidth: 300 }}>
                        <Typography variant="body2" noWrap>
                          {post.content}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {post.platforms.map((platform) => (
                            <Avatar
                              key={platform}
                              sx={{
                                width: 20,
                                height: 20,
                                bgcolor: platformColors[platform],
                              }}
                            >
                              <Box sx={{ fontSize: 12 }}>
                                {platformIcons[platform]}
                              </Box>
                            </Avatar>
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={<ScheduleIcon />}
                          label="Scheduled"
                          size="small"
                          color="warning"
                        />
                      </TableCell>
                      <TableCell>
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
        </Box>
      </Paper>
    </>
  );

  const renderAnalyticsContent = () => (
    <>
      <Typography variant="h6" gutterBottom>
        Social Media Analytics
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Posts
              </Typography>
              <Typography variant="h4">
                {analytics.totalPosts}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last 30 days
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Engagement
              </Typography>
              <Typography variant="h4">
                {analytics.totalEngagement.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="success.main">
                {analytics.growth.engagement} from last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Avg. Engagement Rate
              </Typography>
              <Typography variant="h4">
                {analytics.avgEngagementRate}%
              </Typography>
              <Badge badgeContent={<TrendingUp />} color="success">
                <Typography variant="body2" color="text.secondary">
                  Above industry avg
                </Typography>
              </Badge>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                New Followers
              </Typography>
              <Typography variant="h4">
                {analytics.growth.followers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ mt: 3, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Top Performing Posts
        </Typography>
        <List>
          {posts
            .filter(post => post.engagement)
            .sort((a, b) => (b.engagement?.likes || 0) - (a.engagement?.likes || 0))
            .slice(0, 3)
            .map((post) => (
              <ListItem key={post.id}>
                <ListItemAvatar>
                  {post.media && (
                    <Avatar
                      variant="rounded"
                      src={post.media}
                      sx={{ width: 60, height: 60 }}
                    />
                  )}
                </ListItemAvatar>
                <ListItemText
                  primary={post.content.substring(0, 100) + '...'}
                  secondary={
                    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                      <Typography variant="caption">
                        {post.engagement?.likes} likes
                      </Typography>
                      <Typography variant="caption">
                        {post.engagement?.comments} comments
                      </Typography>
                      <Typography variant="caption">
                        {post.engagement?.shares} shares
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
        </List>
      </Paper>
    </>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', mb: 3 }}>
        Social Media Management
      </Typography>

      <Paper sx={{ width: '100%' }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Posts" icon={<Send />} iconPosition="start" />
          <Tab label="Accounts" icon={<Facebook />} iconPosition="start" />
          <Tab label="Calendar" icon={<CalendarMonth />} iconPosition="start" />
          <Tab label="Analytics" icon={<AnalyticsIcon />} iconPosition="start" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          <TabPanel value={tabValue} index={0}>
            {renderPostsContent()}
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            {renderAccountsContent()}
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            {renderCalendarContent()}
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            {renderAnalyticsContent()}
          </TabPanel>
        </Box>
      </Paper>

      {/* Create Post Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Social Media Post</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Post Content"
                placeholder="What would you like to share?"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                helperText={`${postContent.length}/280 characters`}
              />
            </Grid>
            
            <Grid size={12}>
              <Typography variant="body2" gutterBottom>
                Select Platforms
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {Object.entries(platformIcons).map(([platform, icon]) => (
                  <Chip
                    key={platform}
                    icon={icon as React.ReactElement}
                    label={platform.charAt(0).toUpperCase() + platform.slice(1)}
                    onClick={() => {
                      setSelectedPlatforms(prev =>
                        prev.includes(platform)
                          ? prev.filter(p => p !== platform)
                          : [...prev, platform]
                      );
                    }}
                    color={selectedPlatforms.includes(platform) ? 'primary' : 'default'}
                    variant={selectedPlatforms.includes(platform) ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Grid>

            <Grid size={12}>
              <Button
                variant="outlined"
                startIcon={<ImageIcon />}
                fullWidth
              >
                Add Image or Video
              </Button>
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                type="datetime-local"
                label="Schedule Post"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleCreatePost}
            disabled={!postContent || selectedPlatforms.length === 0}
          >
            {scheduledDate ? 'Schedule Post' : 'Post Now'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SocialMedia;