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
import { Visibility, VisibilityOff, Sparkle, AutoAwesome } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContextPayments';
import { colors } from '../../theme/theme';
import { motion, AnimatePresence } from 'framer-motion';

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

// Spin animation
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Glow animation
const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px ${colors.champagne}40; }
  50% { box-shadow: 0 0 40px ${colors.champagne}60, 0 0 60px ${colors.champagne}40; }
`;

// Shimmer animation
const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
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
          borderRadius: '32px',
          background: `linear-gradient(135deg, ${colors.carbon} 0%, #1a0f1f 25%, #0f0720 50%, ${colors.obsidian} 100%)`,
          backdropFilter: 'blur(40px)',
          border: `2px solid transparent`,
          backgroundClip: 'padding-box',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '500px',
          animation: `${glow} 3s ease-in-out infinite`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '32px',
            padding: '2px',
            background: `linear-gradient(135deg, ${colors.champagne}60, transparent 30%, ${colors.champagne}40 70%, transparent)`,
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            zIndex: -1,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '200px',
            background: `linear-gradient(180deg, ${colors.champagne}10 0%, transparent 100%)`,
            zIndex: 0,
          }
        }
      }}
    >
      {/* Animated Background Elements */}
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
        {/* Floating Orbs */}
        {[...Array(6)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: `${30 + i * 15}px`,
              height: `${30 + i * 15}px`,
              borderRadius: '50%',
              background: `radial-gradient(circle at 30% 30%, ${colors.champagne}50, ${colors.champagne}20, transparent 70%)`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `${float} ${4 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
              opacity: 0.6,
              filter: 'blur(1px)',
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: '20%',
                borderRadius: '50%',
                background: colors.champagne,
                opacity: 0.8,
                filter: 'blur(8px)',
              }
            }}
          />
        ))}
        
        {/* Cosmic Stars */}
        {[...Array(20)].map((_, i) => (
          <Box
            key={`star-${i}`}
            sx={{
              position: 'absolute',
              width: '2px',
              height: '2px',
              background: colors.arctic,
              borderRadius: '50%',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `${pulse} ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
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
        {/* Animated Logo */}
        <Box sx={{
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 100,
          height: 100,
          position: 'relative',
          animation: `${spin} 20s linear infinite`,
        }}>
          {/* Rotating rings */}
          <Box sx={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: `2px solid ${colors.champagne}30`,
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: '-10px',
              borderRadius: '50%',
              border: `1px solid ${colors.champagne}20`,
              borderTopColor: colors.champagne,
              animation: `${spin} 3s linear infinite`,
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: '10px',
              borderRadius: '50%',
              border: `2px solid ${colors.champagne}10`,
              borderBottomColor: colors.champagne,
              animation: `${spin} 2s linear infinite reverse`,
            }
          }} />
          
          {/* Central icon container */}
          <Box sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${colors.champagne} 0%, #ff6b6b 50%, #4ecdc4 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            animation: 'none',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: '3px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${colors.carbon} 0%, ${colors.obsidian} 100%)`,
            }
          }}>
            <Typography variant="h3" sx={{ 
              fontWeight: 900,
              color: colors.champagne,
              position: 'relative',
              zIndex: 1,
              fontFamily: '"Inter", sans-serif',
              background: `linear-gradient(135deg, ${colors.champagne} 0%, #ff6b6b 50%, #4ecdc4 100%)`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.5))'
            }}>
              B
            </Typography>
          </Box>
        </Box>

        {/* Title with gradient */}
        <Typography variant="h4" sx={{
          fontWeight: 900,
          mb: 1,
          textAlign: 'center',
          fontFamily: '"Inter", sans-serif',
          background: `linear-gradient(135deg, ${colors.arctic} 0%, ${colors.champagne} 50%, ${colors.arctic} 100%)`,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundSize: '200% auto',
          animation: `${shimmer} 3s linear infinite`,
          letterSpacing: '0.02em',
        }}>
          BOWERY
        </Typography>

        <Typography variant="subtitle1" sx={{
          mb: 4,
          textAlign: 'center',
          color: colors.champagne,
          fontWeight: 400,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          fontSize: { xs: '0.875rem', sm: '1rem' },
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          '& svg': {
            fontSize: '1rem',
            animation: `${spin} 4s linear infinite`,
          }
        }}>
          <AutoAwesome /> Payment Portal <AutoAwesome />
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
            {/* Google with enhanced styling */}
            <Button
              fullWidth
              variant="contained"
              startIcon={<GoogleIcon />}
              onClick={() => handleProviderSignIn('google')}
              disabled={isLoading}
              sx={{
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 700,
                borderRadius: '20px',
                color: colors.obsidian,
                background: `linear-gradient(135deg, ${colors.champagne} 0%, #ffd700 100%)`,
                border: 'none',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                  transition: 'left 0.5s',
                },
                '&:hover': {
                  transform: 'translateY(-3px) scale(1.02)',
                  boxShadow: `0 12px 30px ${colors.champagne}50, 0 0 40px ${colors.champagne}30`,
                  '&::before': {
                    left: '100%',
                  },
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

            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              my: 3,
              width: '100%' 
            }}>
              <Box sx={{ 
                flex: 1, 
                height: '2px', 
                background: `linear-gradient(90deg, transparent, ${colors.champagne}40, transparent)`,
                borderRadius: '1px',
              }} />
              <Typography variant="caption" sx={{ 
                color: colors.champagne,
                px: 2,
                py: 0.5,
                borderRadius: '12px',
                background: `${colors.champagne}10`,
                border: `1px solid ${colors.champagne}30`,
                fontWeight: 600,
                letterSpacing: '0.1em',
                fontSize: '0.75rem',
                textTransform: 'uppercase'
              }}>
                OR
              </Typography>
              <Box sx={{ 
                flex: 1, 
                height: '2px', 
                background: `linear-gradient(90deg, transparent, ${colors.champagne}40, transparent)`,
                borderRadius: '1px',
              }} />
            </Box>

            {/* Email with glowing effect */}
            <Button
              fullWidth
              variant="outlined"
              startIcon={<EmailIcon />}
              onClick={() => setShowEmailForm(true)}
              disabled={isLoading}
              sx={{
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 700,
                borderRadius: '20px',
                color: colors.arctic,
                background: `linear-gradient(135deg, ${colors.graphite}30, ${colors.obsidian}50)`,
                backdropFilter: 'blur(10px)',
                border: `2px solid ${colors.champagne}30`,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: -2,
                  borderRadius: '20px',
                  padding: '2px',
                  background: `linear-gradient(135deg, ${colors.champagne}, #ff6b6b, #4ecdc4)`,
                  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  maskComposite: 'exclude',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  opacity: 0,
                  transition: 'opacity 0.3s',
                },
                '&:hover': {
                  transform: 'translateY(-3px) scale(1.02)',
                  color: colors.champagne,
                  boxShadow: `0 8px 25px ${colors.champagne}30`,
                  '&::before': {
                    opacity: 1,
                  },
                  '& .MuiButton-startIcon': {
                    transform: 'scale(1.2)',
                  }
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

        {/* Terms with enhanced styling */}
        <Box sx={{
          mt: 4,
          pt: 3,
          borderTop: `1px solid ${colors.champagne}20`,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -1,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60px',
            height: '2px',
            background: `linear-gradient(90deg, transparent, ${colors.champagne}, transparent)`,
          }
        }}>
          <Typography sx={{
            fontSize: '0.75rem',
            textAlign: 'center',
            color: colors.racingSilver,
            maxWidth: '320px',
            lineHeight: 1.6,
            mx: 'auto',
            '& span': {
              color: colors.champagne,
              cursor: 'pointer',
              textDecoration: 'underline',
              textDecorationColor: 'transparent',
              transition: 'all 0.3s',
              '&:hover': {
                textDecorationColor: colors.champagne,
                filter: 'brightness(1.2)',
              }
            }
          }}>
            By continuing, you agree to our <span>Terms of Service</span> and <span>Privacy Policy</span>
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalAuthModal;