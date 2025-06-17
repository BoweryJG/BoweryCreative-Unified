import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Psychology,
  Code,
  Storage,
  Settings,
  SmartToy,
  FiberManualRecord,
  ArrowForward,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { CapabilityModal } from './CapabilityModal';

interface Capability {
  id: string;
  icon: any;
  title: string;
  description: string;
  features: string[];
  gradient: string;
}

const capabilities: Capability[] = [
  {
    id: 'ai-infrastructure',
    icon: Psychology,
    title: 'AI Infrastructure',
    description: 'Medical-grade neural networks and HIPAA-compliant AI systems for healthcare excellence.',
    features: ['FDA-Cleared Algorithms', 'Surgical Robotics AI', 'Diagnostic Intelligence', 'Clinical Decision Support'],
    gradient: 'linear-gradient(135deg, #00BFFF 0%, #0080FF 100%)'
  },
  {
    id: 'machine-learning',
    icon: Psychology,
    title: 'Machine Learning',
    description: 'Predictive analytics for treatment outcomes, patient satisfaction, and practice optimization.',
    features: ['Outcome Prediction', 'Risk Stratification', 'Revenue Optimization', 'Clinical ML Models'],
    gradient: 'linear-gradient(135deg, #76B900 0%, #00D4AA 100%)'
  },
  {
    id: 'full-stack',
    icon: Code,
    title: 'Full-Stack Engineering',
    description: 'Complete digital transformation platforms for medical and aesthetic practices.',
    features: ['Patient Portals', 'Telemedicine Platforms', 'Practice Management', 'Mobile Health Apps'],
    gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
  },
  {
    id: 'data-synthesis',
    icon: Storage,
    title: 'Data Synthesis',
    description: 'Transform clinical data into actionable insights for better outcomes and growth.',
    features: ['Clinical Analytics', 'Market Intelligence', 'Outcome Tracking', 'Regulatory Reporting'],
    gradient: 'linear-gradient(135deg, #E5E5E5 0%, #FFFFFF 100%)'
  },
  {
    id: 'automation',
    icon: Settings,
    title: 'Automation',
    description: 'Intelligent workflow automation to eliminate administrative burden and amplify care.',
    features: ['Revenue Cycle Automation', 'Clinical Documentation', 'Patient Journey', 'Smart Scheduling'],
    gradient: 'linear-gradient(135deg, #1C1C1C 0%, #000000 100%)'
  },
  {
    id: 'ai-luxury',
    icon: SmartToy,
    title: 'AI Luxury Innovation',
    description: 'Bespoke AI experiences for elite medical practices and discerning patients.',
    features: ['Concierge AI', 'VIP Patient Management', 'Luxury Experience Design', 'Elite Outcomes'],
    gradient: 'linear-gradient(135deg, #FFD700 0%, #FF6B6B 100%)'
  }
];

export const Capabilities: React.FC = () => {
  const [selectedCapability, setSelectedCapability] = useState<typeof capabilities[0] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = (capability: typeof capabilities[0]) => {
    setSelectedCapability(capability);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedCapability(null), 300);
  };

  return (
    <Box
      id="capabilities"
      sx={{
        py: 16,
        background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 50%, #1a0f0a 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '25%',
          left: '25%',
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(255, 215, 0, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '25%',
          right: '25%',
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(0, 191, 255, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        {/* Section Header */}
        <Box textAlign="center" mb={10}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                mb: 3,
              }}
            >
              <Box sx={{ height: '1px', width: 60, bgcolor: '#FFD700' }} />
              <Typography
                variant="caption"
                sx={{
                  color: '#FFD700',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  fontFamily: 'monospace',
                  fontWeight: 500,
                }}
              >
                Precision-Crafted Solutions
              </Typography>
              <Box sx={{ height: '1px', width: 60, bgcolor: '#FFD700' }} />
            </Box>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem', lg: '5rem' },
                fontWeight: 400,
                mb: 4,
                background: 'linear-gradient(135deg, #FFD700 0%, #FFEF94 50%, #FFD700 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Engineering
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '3rem', lg: '4rem' },
                fontWeight: 400,
                color: '#F8F8FF',
                mb: 4,
              }}
            >
              Intelligence
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Typography
              variant="h5"
              sx={{
                color: '#E5E5E5',
                fontWeight: 300,
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              From machine learning infrastructure to full-stack applications, 
              we craft bespoke solutions that push the boundaries of what's possible.
            </Typography>
          </motion.div>
        </Box>

        {/* Capabilities Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            },
            gap: 4,
          }}
        >
          {capabilities.map((capability, index) => {
            const IconComponent = capability.icon;
            return (
              <motion.div
                key={capability.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
              >
                <Card
                    onClick={() => handleOpenModal(capability)}
                    sx={{
                      height: '100%',
                      background: 'rgba(28, 28, 28, 0.8)',
                      border: '1px solid rgba(45, 45, 45, 0.5)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.5s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        border: '1px solid rgba(255, 215, 0, 0.4)',
                        '& .capability-icon': {
                          transform: 'scale(1.1)',
                        },
                        '& .learn-more': {
                          opacity: 1,
                          transform: 'translateX(0)',
                        },
                        '&::before': {
                          opacity: 0.1,
                        }
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: capability.gradient,
                        opacity: 0,
                        transition: 'opacity 0.5s ease',
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4, position: 'relative', zIndex: 2 }}>
                      {/* Icon */}
                      <Box sx={{ mb: 3 }}>
                        <Box
                          className="capability-icon"
                          sx={{
                            width: 64,
                            height: 64,
                            background: capability.gradient,
                            p: 0.5,
                            transition: 'transform 0.5s ease',
                          }}
                        >
                          <Box
                            sx={{
                              width: '100%',
                              height: '100%',
                              bgcolor: '#1C1C1C',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <IconComponent sx={{ fontSize: 32, color: '#F8F8FF' }} />
                          </Box>
                        </Box>
                      </Box>

                      {/* Content */}
                      <Typography
                        variant="h6"
                        sx={{
                          color: '#F8F8FF',
                          fontWeight: 400,
                          mb: 2,
                          fontSize: '1.25rem',
                          transition: 'color 0.3s ease',
                        }}
                      >
                        {capability.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: '#E5E5E5',
                          lineHeight: 1.6,
                          mb: 3,
                        }}
                      >
                        {capability.description}
                      </Typography>

                      {/* Features */}
                      <List dense>
                        {capability.features.map((feature) => (
                          <ListItem key={feature} sx={{ px: 0, py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 20 }}>
                              <FiberManualRecord
                                sx={{
                                  fontSize: 8,
                                  color: '#FFD700',
                                }}
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={feature}
                              primaryTypographyProps={{
                                variant: 'caption',
                                sx: { color: '#C0C0C0', fontSize: '0.75rem' }
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>

                      {/* Learn More */}
                      <Box
                        className="learn-more"
                        sx={{
                          mt: 3,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          color: '#FFD700',
                          opacity: 0,
                          transform: 'translateX(-10px)',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          Learn More
                        </Typography>
                        <ArrowForward sx={{ fontSize: 16 }} />
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
            );
          })}
        </Box>

        {/* Performance Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          <Box
            sx={{
              mt: 12,
              p: 6,
              background: 'rgba(28, 28, 28, 0.2)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(192, 192, 192, 0.2)',
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(2, 1fr)',
                  md: 'repeat(4, 1fr)',
                },
                gap: 4,
                textAlign: 'center',
              }}
            >
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    color: '#FFD700',
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  99.9%
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#C0C0C0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  Uptime
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    color: '#FFD700',
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  &lt;100ms
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#C0C0C0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  Response
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    color: '#FFD700',
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  50+
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#C0C0C0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  AI Models
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    color: '#FFD700',
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  24/7
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#C0C0C0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  Support
                </Typography>
              </Box>
            </Box>
          </Box>
        </motion.div>
      </Container>

      {/* Capability Modal */}
      <CapabilityModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        capability={selectedCapability}
      />
    </Box>
  );
};