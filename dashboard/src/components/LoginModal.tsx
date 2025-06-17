import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Divider,
} from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
  const { signIn, signInWithGoogle, user, hasAccess } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Check if user is logged in but unauthorized
  const isUnauthorized = user && !hasAccess;
  
  // Close modal when user successfully logs in and has access
  React.useEffect(() => {
    if (user && hasAccess) {
      onClose();
    }
  }, [user, hasAccess, onClose]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      console.log('LoginModal: Starting sign in process');
      await signIn(email, password);
      console.log('LoginModal: Sign in completed, user:', user, 'hasAccess:', hasAccess);
      onClose();
    } catch (err: any) {
      console.error('LoginModal: Sign in error:', err);
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    
    try {
      await signInWithGoogle();
      // Don't close modal - let OAuth redirect handle it
      // The page will reload after successful auth
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={isUnauthorized ? () => {} : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="div" sx={{ color: 'primary.main' }}>
          {isUnauthorized ? 'Access Restricted' : 'Welcome to Mission Control'}
        </Typography>
      </DialogTitle>
      
      <form onSubmit={handleEmailSignIn}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {isUnauthorized && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Unauthorized Access
              </Typography>
              <Typography variant="body2">
                Your account ({user.email}) does not have access to the Mission Control dashboard. 
                This area is restricted to authorized administrators and clients only.
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                If you believe you should have access, please contact your administrator.
              </Typography>
            </Alert>
          )}
          
          {!isUnauthorized && (
            <>
              <Box sx={{ mb: 3 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  startIcon={<GoogleIcon />}
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  sx={{ mb: 2 }}
                >
                  Sign in with Google
                </Button>
              </Box>
              
              <Divider sx={{ my: 3 }}>OR</Divider>
              
              <TextField
                autoFocus
                margin="dense"
                label="Email Address"
                type="email"
                fullWidth
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                sx={{ mb: 2 }}
              />
              
              <TextField
                margin="dense"
                label="Password"
                type="password"
                fullWidth
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </>
          )}
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          {isUnauthorized ? (
            <Button onClick={() => window.location.href = '/'} variant="contained">
              Return to Main Site
            </Button>
          ) : (
            <>
              <Button onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                disabled={loading || !email || !password}
              >
                Sign In
              </Button>
            </>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LoginModal;