import React, { useState } from 'react';
import { Box, Button, Container, Typography, Paper, Dialog, TextField, Alert, IconButton } from '@mui/material';
import { Rocket, Dashboard as DashboardIcon, Login, Close as CloseIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, signIn } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    
    try {
      await signIn(loginForm.email, loginForm.password);
      setLoginModalOpen(false);
      setLoginForm({ email: '', password: '' });
      navigate('/dashboard');
    } catch (error: any) {
      setLoginError(error.message || 'Failed to login');
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background effects */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.1,
        background: `
          radial-gradient(circle at 20% 80%, #fbbf24 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, #f97316 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, #fbbf24 0%, transparent 50%)
        `,
        animation: 'pulse 10s infinite'
      }} />

      {/* Navbar */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          py: 2,
          px: 4,
          zIndex: 10,
          background: 'rgba(26, 26, 46, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  border: '2px solid #fbbf24',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography sx={{ color: '#fbbf24', fontWeight: 'bold' }}>B</Typography>
              </Box>
              <Typography
                variant="h6"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setLoginModalOpen(true);
                  console.log('BOWERY clicked - opening login modal');
                }}
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  cursor: 'pointer',
                  userSelect: 'none',
                  '&:hover': {
                    color: '#fbbf24',
                  },
                  transition: 'color 0.2s ease',
                }}
              >
                BOWERY
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {user ? (
                <Button
                  variant="outlined"
                  startIcon={<DashboardIcon />}
                  onClick={() => navigate('/dashboard')}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'rgba(255,255,255,0.5)',
                      background: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    startIcon={<Login />}
                    onClick={() => setLoginModalOpen(true)}
                    sx={{
                      background: '#fbbf24',
                      color: '#000',
                      fontWeight: 600,
                      '&:hover': {
                        background: '#f59e0b'
                      }
                    }}
                  >
                    Admin Login
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Login />}
                    onClick={() => navigate('/login')}
                    sx={{
                      borderColor: 'rgba(255,255,255,0.3)',
                      color: 'white',
                      '&:hover': {
                        borderColor: 'rgba(255,255,255,0.5)',
                        background: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    Client Login
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pt: 12, pb: 8, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h1" sx={{ 
            fontSize: { xs: '3rem', md: '5rem' },
            fontWeight: 'bold',
            mb: 3,
            background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent'
          }}>
            Bowery Creative
          </Typography>
          <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4 }}>
            AI-Powered Marketing Solutions for Medical Aesthetics
          </Typography>
        </Box>

        {/* Main CTA Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, mb: 8 }}>
          <Paper sx={{ 
            p: 6, 
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 4,
            maxWidth: 600,
            width: '100%',
            textAlign: 'center'
          }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
              Ready to Transform Your Practice?
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: 'rgba(255,255,255,0.8)' }}>
              Join leading medical spas and aesthetic practices using our AI-driven marketing platform
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<Rocket />}
                onClick={() => navigate('/onboarding')}
                sx={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
                  color: 'black',
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                START PROJECT
              </Button>

              {user ? (
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<DashboardIcon />}
                  onClick={() => navigate('/dashboard')}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    py: 1.5,
                    '&:hover': {
                      borderColor: 'rgba(255,255,255,0.5)',
                      background: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Go to Dashboard
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<Login />}
                  onClick={() => navigate('/login')}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    py: 1.5,
                    '&:hover': {
                      borderColor: 'rgba(255,255,255,0.5)',
                      background: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Client Login
                </Button>
              )}
            </Box>
          </Paper>

          {/* Features */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 3,
            mt: 6,
            width: '100%'
          }}>
            {[
              {
                title: 'AI Content Creation',
                description: 'Generate engaging content tailored to your practice'
              },
              {
                title: 'Automated Campaigns',
                description: 'Set up and run marketing campaigns on autopilot'
              },
              {
                title: 'Real-time Analytics',
                description: 'Track performance and ROI with detailed insights'
              }
            ].map((feature, index) => (
              <Paper key={index} sx={{
                p: 4,
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 2,
                textAlign: 'center',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(255,255,255,0.08)',
                  transform: 'translateY(-4px)'
                }
              }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  {feature.description}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>
      </Container>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(1.1); opacity: 0.2; }
        }
      `}</style>

      {/* Hidden Login Modal */}
      <Dialog
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: '#1a1a2e',
            border: '1px solid rgba(255,255,255,0.1)',
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
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            <CloseIcon />
          </IconButton>
          
          <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
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
              InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
              InputProps={{
                sx: {
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.2)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#fbbf24',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#fbbf24',
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
              InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
              InputProps={{
                sx: {
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.2)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#fbbf24',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#fbbf24',
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
                background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
                color: 'black',
                fontWeight: 600,
                py: 1.5,
                '&:hover': {
                  background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
                },
                '&:disabled': {
                  background: 'rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.5)',
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