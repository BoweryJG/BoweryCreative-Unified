import React, { useState, useEffect } from 'react';
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
  Alert,
  useMediaQuery,
  useTheme as useThemeHook
} from '@mui/material';
import {
  Dashboard,
  People,
  Chat,
  Email,
  Share,
  Create,
  Analytics as AnalyticsIcon,
  Settings,
  Business,
  Menu as MenuIcon,
  Campaign as CampaignIcon,
  ShoppingCart as ShoppingCartIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import ContentStudio from './components/ContentStudio';
import EmailMarketing from './components/EmailMarketing';
import SEOAnalyzer from './components/SEOAnalyzer';
import SocialMedia from './components/SocialMedia';
import Analytics from './components/Analytics';
import CampaignMarketplace from './components/CampaignMarketplace';
import CampaignManager from './components/CampaignManager';
import ClientManagement from './components/ClientManagement';
import ClientDashboard from './components/ClientDashboard';
import LoginModal from './components/LoginModal';
import { BillingAdmin } from './components/BillingAdmin';
import { useAuth } from './contexts/AuthContext';
import { IconButton } from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import DebugAuth from './components/DebugAuth';

// Mission Control Theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#d4af37', // Gold
    },
    secondary: {
      main: '#ffffff',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%)',
          border: '1px solid #333',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
  },
});

const drawerWidth = 280;

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

const navigationItems: NavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <Dashboard /> },
  { id: 'clients', label: 'Clients', icon: <Business />, badge: 3 },
  { id: 'billing', label: 'Billing', icon: <ReceiptIcon /> },
  { id: 'contacts', label: 'Contacts', icon: <People />, badge: 12 },
  { id: 'chatbots', label: 'AI Chatbots', icon: <Chat />, badge: 2 },
  { id: 'campaigns', label: 'Campaign Marketplace', icon: <CampaignIcon /> },
  { id: 'my-campaigns', label: 'My Campaigns', icon: <ShoppingCartIcon /> },
  { id: 'email', label: 'Email Marketing', icon: <Email /> },
  { id: 'social', label: 'Social Media', icon: <Share /> },
  { id: 'content', label: 'Content Studio', icon: <Create /> },
  { id: 'seo', label: 'SEO Analyzer', icon: <AnalyticsIcon /> },
  { id: 'analytics', label: 'Analytics', icon: <AnalyticsIcon /> },
  { id: 'settings', label: 'Settings', icon: <Settings /> },
];

// Sample data for the dashboard
const dashboardStats = [
  { title: 'Active Clients', value: '12', change: '+2 this month', color: '#4caf50' },
  { title: 'Campaign Credits', value: '245', change: '45 used this week', color: '#d4af37' },
  { title: 'Email Campaigns', value: '24', change: '3 scheduled', color: '#ff9800' },
  { title: 'Social Posts', value: '89', change: '12 published today', color: '#9c27b0' },
];

const recentActivities = [
  { type: 'campaign', message: 'New Patient Welcome campaign purchased - 20 credits', time: '15 min ago' },
  { type: 'chatbot', message: 'Dr. Smith\'s chatbot answered 15 questions today', time: '2 hours ago' },
  { type: 'email', message: 'Welcome email campaign sent to 45 new subscribers', time: '3 hours ago' },
  { type: 'social', message: 'Instagram post published for Wellness Clinic', time: '5 hours ago' },
];

function App() {
  const { user, loading, signOut, hasAccess, isAdmin, isAuthorizedClient, clientData } = useAuth();
  const [selectedView, setSelectedView] = useState('dashboard');
  const [loginOpen, setLoginOpen] = useState(false);
  
  // Mobile detection
  const themeHook = useThemeHook();
  const isMobile = useMediaQuery(themeHook.breakpoints.down('md'));
  
  // Set drawer open state based on screen size
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);

  useEffect(() => {
    // TEMPORARY: Skip auth check for testing
    if (!loading && !user) {
      setLoginOpen(true);
    } else if (user && !hasAccess) {
      // User is logged in but not authorized
      setLoginOpen(true);
    } else if (user && hasAccess) {
      setLoginOpen(false);
    }
  }, [user, loading, hasAccess]);
  
  // Auto-close drawer on mobile when screen size changes
  useEffect(() => {
    setDrawerOpen(!isMobile);
  }, [isMobile]);

  const handleSignOut = async () => {
    try {
      await signOut();
      setLoginOpen(true);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderDashboard = () => (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', mb: 3 }}>
        Mission Control Dashboard
      </Typography>
      
      <Alert severity="success" sx={{ mb: 3 }}>
        🚀 Mission Control Platform is now live! All systems operational.
      </Alert>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {dashboardStats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom variant="h6">
                  {stat.title}
                </Typography>
                <Typography variant="h4" component="h2" sx={{ color: stat.color, mb: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {stat.change}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity & Quick Actions */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              {recentActivities.map((activity, index) => (
                <ListItem key={index} divider={index < recentActivities.length - 1}>
                  <ListItemIcon>
                    {activity.type === 'campaign' && <CampaignIcon sx={{ color: '#d4af37' }} />}
                    {activity.type === 'chatbot' && <Chat color="primary" />}
                    {activity.type === 'email' && <Email color="secondary" />}
                    {activity.type === 'social' && <Share color="info" />}
                    {activity.type === 'content' && <Create color="warning" />}
                  </ListItemIcon>
                  <ListItemText 
                    primary={activity.message}
                    secondary={activity.time}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button variant="contained" fullWidth startIcon={<People />}>
                Add New Client
              </Button>
              <Button variant="outlined" fullWidth startIcon={<Chat />}>
                Create Chatbot
              </Button>
              <Button variant="outlined" fullWidth startIcon={<Email />}>
                Send Campaign
              </Button>
              <Button variant="outlined" fullWidth startIcon={<Create />}>
                Generate Content
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );

  const renderPlaceholder = (title: string) => (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
        {title}
      </Typography>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          {title} interface coming soon...
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
          This section will provide comprehensive {title.toLowerCase()} management capabilities.
        </Typography>
      </Paper>
    </Container>
  );

  const renderContent = () => {
    // Show client dashboard for authorized clients
    if (isAuthorizedClient && !isAdmin) {
      return <ClientDashboard />;
    }
    
    // Show admin dashboard for admins
    switch (selectedView) {
      case 'dashboard':
        return renderDashboard();
      case 'clients':
        return <ClientManagement />;
      case 'billing':
        return <BillingAdmin />;
      case 'contacts':
        return renderPlaceholder('Contact Management');
      case 'chatbots':
        return renderPlaceholder('AI Chatbots');
      case 'campaigns':
        return <CampaignMarketplace />;
      case 'my-campaigns':
        return <CampaignManager />;
      case 'email':
        return <EmailMarketing />;
      case 'social':
        return <SocialMedia />;
      case 'content':
        return <ContentStudio />;
      case 'seo':
        return <SEOAnalyzer />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return renderPlaceholder('Settings');
      default:
        return renderDashboard();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        {/* App Bar */}
        <AppBar 
          position="fixed" 
          sx={{ 
            zIndex: theme.zIndex.drawer + 1,
            background: 'linear-gradient(90deg, #000000 0%, #1a1a1a 100%)',
          }}
        >
          <Toolbar>
            {isAdmin && (
              <Button
                color="inherit"
                onClick={() => setDrawerOpen(!drawerOpen)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </Button>
            )}
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'primary.main' }}>
              Mission Control {isAuthorizedClient && !isAdmin && `- ${clientData?.organization_name}`}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
              Bowery Creative Agency
            </Typography>
            {user && (
              <>
                <Typography variant="body2" sx={{ ml: 2, display: { xs: 'none', md: 'block' } }}>
                  {user.email}
                </Typography>
                <IconButton color="inherit" onClick={handleSignOut} sx={{ ml: 1 }}>
                  <LogoutIcon />
                </IconButton>
              </>
            )}
          </Toolbar>
        </AppBar>

        {/* Navigation Drawer - Only show for admins */}
        {isAdmin && (
          <Drawer
            variant={isMobile ? 'temporary' : 'persistent'}
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
                background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
                borderRight: '1px solid #333',
              },
            }}
          >
          <Toolbar />
          <Box sx={{ overflow: 'auto', mt: 2 }}>
            <List>
              {navigationItems.map((item) => (
                <ListItem 
                  key={item.id}
                  onClick={() => {
                    setSelectedView(item.id);
                    if (isMobile) {
                      setDrawerOpen(false);
                    }
                  }}
                  sx={{ 
                    cursor: 'pointer',
                    mx: 1,
                    borderRadius: 2,
                    mb: 0.5,
                    '&:hover': {
                      backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    },
                    backgroundColor: selectedView === item.id ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                  }}
                >
                  <ListItemIcon sx={{ color: selectedView === item.id ? 'primary.main' : 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label}
                    sx={{ 
                      '& .MuiListItemText-primary': {
                        color: selectedView === item.id ? 'primary.main' : 'inherit',
                        fontWeight: selectedView === item.id ? 600 : 400,
                      }
                    }}
                  />
                  {item.badge && (
                    <Box
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'black',
                        borderRadius: '50%',
                        width: 20,
                        height: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                      }}
                    >
                      {item.badge}
                    </Box>
                  )}
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
        )}

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            transition: theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: {
              xs: 0, // No margin on mobile
              md: isAdmin && drawerOpen ? 0 : isAdmin ? `-${drawerWidth}px` : 0, // Margin only for admin with drawer
            },
          }}
        >
          <Toolbar />
          {renderContent()}
        </Box>
      </Box>
      
      <LoginModal 
        open={loginOpen} 
        onClose={() => setLoginOpen(false)} 
      />
      
      {/* Debug info - remove this later */}
      <DebugAuth />
    </ThemeProvider>
  );
}

export default App;