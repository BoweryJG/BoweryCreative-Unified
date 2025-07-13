import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Button,
  IconButton,
  Typography,
  Box,
  TextField,
  Alert,
  CircularProgress,
  keyframes,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import EmailIcon from '@mui/icons-material/Email';
import PaymentIcon from '@mui/icons-material/Payment';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContextPayments';
import { colors } from '../../theme/theme';

interface GlobalAuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}


// Floating animation
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(180deg); }
`;

// Pulse animation
const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
`;

const GlobalAuthModal: React.FC<GlobalAuthModalProps> = ({ open, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { signInWithProvider, signInWithEmail, signUpWithEmail } = useAuth();

  const handleProviderSignIn = async (provider: 'google' | 'facebook') => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await signInWithProvider(provider);
      console.log('Auth result:', result);
      // Don't close modal or call success here - let OAuth redirect handle it
    } catch (error: any) {
      console.error('Auth error:', error);
      setError(error.message || 'Authentication failed');
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
      onSuccess?.();
      onClose();
    } catch (error: any) {
      setError(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setError(null);
    setShowEmailForm(false);
    setIsSignUp(false);
    setShowPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
          background: `linear-gradient(135deg, ${colors.carbon} 0%, ${colors.obsidian} 100%)`,
          backdropFilter: 'blur(40px)',
          border: `1px solid ${colors.champagne}30`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 100px ${colors.champagne}20`,
          position: 'relative',
          overflow: 'hidden',
          minHeight: '400px',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: `linear-gradient(90deg, transparent 0%, ${colors.champagne} 20%, ${colors.champagne} 80%, transparent 100%)`,
            zIndex: 1,
          }
        }
      }}
    >
      {/* Floating Orbs Background */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none'
      }}>
        {[...Array(4)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: `${20 + i * 10}px`,
              height: `${20 + i * 10}px`,
              borderRadius: '50%',
              background: `linear-gradient(45deg, ${colors.champagne}40, transparent)`,
              top: `${10 + i * 25}%`,
              left: `${5 + i * 20}%`,
              animation: `${float} ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
              opacity: 0.4,
            }}
          />
        ))}
      </Box>

      {/* Close Button */}
      <IconButton
        onClick={handleClose}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 10,
          color: colors.arctic,
          backgroundColor: `${colors.graphite}80`,
          backdropFilter: 'blur(10px)',
          '&:hover': {
            backgroundColor: `${colors.champagne}20`,
            transform: 'scale(1.1)',
          }
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ 
        p: 4,
        pt: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Bowery Logo */}
        <Box sx={{
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${colors.champagne} 0%, ${colors.graphite} 100%)`,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: '2px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${colors.carbon} 0%, ${colors.obsidian} 100%)`,
          }
        }}>
          <PaymentIcon sx={{ 
            fontSize: 40, 
            color: colors.champagne,
            position: 'relative',
            zIndex: 1,
            animation: `${pulse} 2s ease-in-out infinite`
          }} />
        </Box>

        {/* Title */}
        <Typography variant="h4" sx={{
          fontWeight: 800,
          mb: 1,
          textAlign: 'center',
          color: colors.arctic,
          fontFamily: '"Inter", sans-serif',
        }}>
          BOWERY
        </Typography>

        <Typography variant="subtitle1" sx={{
          mb: 3,
          textAlign: 'center',
          color: colors.champagne,
          fontWeight: 300,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
        }}>
          Payment Portal
        </Typography>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              width: '100%',
              borderRadius: '12px',
              backgroundColor: `${colors.carbon}80`,
              color: colors.arctic,
              '& .MuiAlert-icon': {
                color: '#ff6b6b'
              }
            }}
          >
            {error}
          </Alert>
        )}

        {!showEmailForm ? (
          /* Social Auth Options */
          <Box sx={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Google */}
            <Button
              fullWidth
              variant="contained"
              startIcon={<GoogleIcon />}
              onClick={() => handleProviderSignIn('google')}
              disabled={isLoading}
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '16px',
                color: colors.obsidian,
                background: colors.champagne,
                border: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: '#e4c547',
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 25px ${colors.champagne}40`,
                },
                '&:disabled': {
                  opacity: 0.7,
                }
              }}
            >
              {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Continue with Google'}
            </Button>

            {/* Facebook */}
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FacebookIcon />}
              onClick={() => handleProviderSignIn('facebook')}
              disabled={isLoading}
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '16px',
                color: colors.champagne,
                borderColor: colors.champagne,
                background: 'transparent',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  borderColor: colors.champagne,
                  backgroundColor: `${colors.champagne}10`,
                  transform: 'translateY(-2px)',
                },
                '&:disabled': {
                  opacity: 0.7,
                }
              }}
            >
              Continue with Facebook
            </Button>

            <Divider sx={{ 
              my: 2,
              '&::before, &::after': {
                borderColor: colors.graphite
              }
            }}>
              <Typography sx={{ 
                color: colors.racingSilver,
                fontSize: '0.875rem' 
              }}>
                or
              </Typography>
            </Divider>

            {/* Email */}
            <Button
              fullWidth
              variant="outlined"
              startIcon={<EmailIcon />}
              onClick={() => setShowEmailForm(true)}
              disabled={isLoading}
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '16px',
                color: colors.arctic,
                borderColor: colors.graphite,
                background: 'transparent',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  borderColor: colors.arctic,
                  backgroundColor: `${colors.arctic}10`,
                  transform: 'translateY(-2px)',
                }
              }}
            >
              Continue with Email
            </Button>
          </Box>
        ) : (
          /* Email Form */
          <Box 
            component="form" 
            onSubmit={handleEmailAuth}
            sx={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <Typography variant="h6" sx={{ 
              color: colors.arctic, 
              textAlign: 'center', 
              mb: 1,
              fontWeight: 500 
            }}>
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Typography>

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  color: colors.arctic,
                  '& fieldset': {
                    borderColor: colors.graphite
                  },
                  '&:hover fieldset': {
                    borderColor: colors.champagne
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: colors.champagne
                  }
                },
                '& .MuiInputLabel-root': {
                  color: colors.racingSilver,
                  '&.Mui-focused': {
                    color: colors.champagne
                  }
                }
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: colors.racingSilver }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  color: colors.arctic,
                  '& fieldset': {
                    borderColor: colors.graphite
                  },
                  '&:hover fieldset': {
                    borderColor: colors.champagne
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: colors.champagne
                  }
                },
                '& .MuiInputLabel-root': {
                  color: colors.racingSilver,
                  '&.Mui-focused': {
                    color: colors.champagne
                  }
                }
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                py: 1.5,
                mt: 1,
                borderRadius: '12px',
                background: colors.champagne,
                color: colors.obsidian,
                fontWeight: 600,
                fontSize: '1rem',
                '&:hover': {
                  background: '#e4c547',
                  transform: 'translateY(-1px)',
                  boxShadow: `0 8px 25px ${colors.champagne}40`,
                },
                '&:disabled': {
                  opacity: 0.7,
                }
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} sx={{ color: colors.obsidian }} />
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography sx={{ 
                color: colors.racingSilver,
                fontSize: '0.9rem',
                mb: 1
              }}>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              </Typography>
              <Button
                onClick={() => setIsSignUp(!isSignUp)}
                sx={{
                  color: colors.champagne,
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: `${colors.champagne}10`,
                  }
                }}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </Button>
            </Box>

            <Button
              onClick={() => setShowEmailForm(false)}
              sx={{
                color: colors.racingSilver,
                fontSize: '0.875rem',
                '&:hover': {
                  backgroundColor: `${colors.graphite}20`,
                }
              }}
            >
              ← Back to options
            </Button>
          </Box>
        )}

        {/* Terms */}
        <Typography sx={{
          mt: 3,
          fontSize: '0.75rem',
          textAlign: 'center',
          color: colors.racingSilver,
          maxWidth: '280px',
          lineHeight: 1.4,
        }}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalAuthModal;