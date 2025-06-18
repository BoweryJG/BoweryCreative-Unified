import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Paper,
  Dialog,
  DialogContent,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  History,
  Settings,
  ExitToApp,
  CreditCard,
  Subscriptions,
  AdminPanelSettings,
  People,
  Receipt,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../theme/theme';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 280;

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  currentPage,
  onPageChange,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const { user, signOut, signIn, isAdmin } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  // Helper function to get initials from name or email
  const getInitials = (name?: string | null): string => {
    if (!name) return '?';
    
    // If it's an email, just use first letter
    if (name.includes('@')) {
      return name.charAt(0).toUpperCase();
    }
    
    // If it's a full name, get first letter of first and last name
    const names = name.trim().split(' ');
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
    }
    
    // Single name, just first letter
    return name.charAt(0).toUpperCase();
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    await signOut();
    handleClose();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    
    try {
      await signIn(loginForm.email, loginForm.password);
      setLoginModalOpen(false);
      setLoginForm({ email: '', password: '' });
      // Redirect to admin dashboard after successful login
      navigate('/dashboard');
    } catch (error: any) {
      setLoginError(error.message || 'Failed to login');
    } finally {
      setLoginLoading(false);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Dashboard /> },
    { id: 'subscriptions', label: 'Subscriptions', icon: <Subscriptions /> },
    { id: 'credits', label: 'Campaign Credits', icon: <CreditCard /> },
    ...(isAdmin ? [
      { id: 'clients', label: 'Client Management', icon: <People /> },
      { id: 'invoices', label: 'Invoice Management', icon: <Receipt /> },
    ] : []),
    { id: 'payments', label: 'Payment History', icon: <History /> },
    { id: 'settings', label: 'Settings', icon: <Settings /> },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin', icon: <AdminPanelSettings /> }] : []),
  ];

  const drawer = (
    <Box sx={{ height: '100%', background: colors.carbon }}>
      {/* Logo */}
      <Box
        sx={{
          p: 3,
          borderBottom: `1px solid ${colors.graphite}`,
          background: `linear-gradient(135deg, ${colors.carbon} 0%, ${colors.graphite} 100%)`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              border: `2px solid ${colors.champagne}`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(135deg, ${colors.champagne}20, transparent)`,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: colors.champagne,
                fontWeight: 600,
                fontFamily: '"Inter", sans-serif',
              }}
            >
              B
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="h6"
              onClick={() => setLoginModalOpen(true)}
              sx={{
                color: colors.arctic,
                fontWeight: 600,
                fontSize: '1.1rem',
                lineHeight: 1,
                cursor: 'pointer',
                '&:hover': {
                  color: colors.champagne,
                },
                transition: 'color 0.2s ease',
              }}
            >
              BOWERY
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: colors.champagne,
                fontWeight: 300,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontSize: '0.7rem',
              }}
            >
              Payments
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation */}
      <List sx={{ px: 2, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={currentPage === item.id}
              onClick={() => {
                onPageChange(item.id);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  background: `linear-gradient(135deg, ${colors.champagne}20, ${colors.champagne}10)`,
                  borderLeft: `3px solid ${colors.champagne}`,
                  '& .MuiListItemIcon-root': {
                    color: colors.champagne,
                  },
                  '& .MuiListItemText-primary': {
                    color: colors.arctic,
                    fontWeight: 600,
                  },
                },
                '&:hover': {
                  background: `${colors.champagne}10`,
                },
                transition: 'all 0.2s ease',
              }}
            >
              <ListItemIcon
                sx={{
                  color: currentPage === item.id ? colors.champagne : colors.racingSilver,
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: currentPage === item.id ? 600 : 400,
                  color: currentPage === item.id ? colors.arctic : colors.racingSilver,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* User Info */}
      <Box sx={{ mt: 'auto', p: 2, borderTop: `1px solid ${colors.graphite}` }}>
        <Paper
          sx={{
            p: 2,
            background: `linear-gradient(135deg, ${colors.graphite}40, ${colors.carbon})`,
            border: `1px solid ${colors.graphite}`,
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={user?.user_metadata?.avatar_url || user?.user_metadata?.picture}
              sx={{
                bgcolor: colors.champagne,
                color: colors.obsidian,
                width: 40,
                height: 40,
                fontSize: '0.875rem',
                fontWeight: 600,
                border: `2px solid ${colors.champagne}`,
              }}
            >
              {getInitials(user?.user_metadata?.full_name || user?.email)}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  color: colors.arctic,
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user?.user_metadata?.full_name || user?.email}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: colors.racingSilver,
                  fontSize: '0.75rem',
                }}
              >
                Active Plan
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: colors.obsidian }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          background: colors.carbon,
          borderBottom: `1px solid ${colors.graphite}`,
          boxShadow: 'none',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ 
              flexGrow: 1,
              color: colors.arctic,
              fontWeight: 500,
              textTransform: 'capitalize',
            }}
          >
            {currentPage}
          </Typography>

          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
            sx={{ p: 0.5 }}
          >
            <Avatar
              src={user?.user_metadata?.avatar_url || user?.user_metadata?.picture}
              sx={{
                bgcolor: colors.champagne,
                color: colors.obsidian,
                width: 36,
                height: 36,
                fontSize: '0.875rem',
                fontWeight: 600,
                border: `2px solid ${colors.champagne}`,
              }}
            >
              {getInitials(user?.user_metadata?.full_name || user?.email)}
            </Avatar>
          </IconButton>
          
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                background: colors.carbon,
                border: `1px solid ${colors.graphite}`,
                minWidth: 180,
              },
            }}
          >
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Settings fontSize="small" sx={{ color: colors.racingSilver }} />
              </ListItemIcon>
              <Typography variant="body2">Profile</Typography>
            </MenuItem>
            <MenuItem onClick={handleSignOut}>
              <ListItemIcon>
                <ExitToApp fontSize="small" sx={{ color: colors.racingSilver }} />
              </ListItemIcon>
              <Typography variant="body2">Sign Out</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              background: colors.carbon,
              border: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              background: colors.carbon,
              border: 'none',
              borderRight: `1px solid ${colors.graphite}`,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          background: colors.obsidian,
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>

      {/* Hidden Login Modal */}
      <Dialog
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: colors.carbon,
            border: `1px solid ${colors.graphite}`,
            borderRadius: 2,
          },
        }}
      >
        <Box sx={{ p: 3, position: 'relative' }}>
          <IconButton
            onClick={() => setLoginModalOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: colors.racingSilver,
            }}
          >
            <CloseIcon />
          </IconButton>
          
          <Typography variant="h5" sx={{ color: colors.arctic, mb: 3, fontWeight: 600 }}>
            Admin Login
          </Typography>
          
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              sx={{ mb: 2 }}
              required
              InputLabelProps={{ sx: { color: colors.racingSilver } }}
              InputProps={{
                sx: {
                  color: colors.arctic,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.graphite,
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.champagne,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.champagne,
                  },
                },
              }}
            />
            
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              sx={{ mb: 3 }}
              required
              InputLabelProps={{ sx: { color: colors.racingSilver } }}
              InputProps={{
                sx: {
                  color: colors.arctic,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.graphite,
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.champagne,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.champagne,
                  },
                },
              }}
            />
            
            {loginError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {loginError}
              </Alert>
            )}
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loginLoading}
              sx={{
                background: `linear-gradient(135deg, ${colors.champagne}, ${colors.champagne}DD)`,
                color: colors.obsidian,
                fontWeight: 600,
                py: 1.5,
                '&:hover': {
                  background: colors.champagne,
                },
                '&:disabled': {
                  background: colors.graphite,
                  color: colors.racingSilver,
                },
              }}
            >
              {loginLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </Box>
      </Dialog>
    </Box>
  );
};