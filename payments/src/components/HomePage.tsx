import React, { useState } from 'react';
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { Rocket, Dashboard as DashboardIcon, Login } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

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

      <Container maxWidth="lg" sx={{ pt: 8, pb: 8, position: 'relative', zIndex: 1 }}>
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
    </Box>
  );
};