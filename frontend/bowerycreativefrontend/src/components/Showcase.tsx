import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogContent,
  alpha,
} from '@mui/material';
import {
  Visibility,
  Close,
  Psychology,
  LocalHospital,
  ShowChart,
  Security,
  ThreeDRotation,
  CloudQueue,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  techStack: string[];
  metrics: { label: string; value: string }[];
  icon: React.ReactNode;
  gradient: string;
  featured?: boolean;
  details?: string[];
  marketSize?: string;
  liveUrl?: string;
  githubUrl?: string;
}

const projects: Project[] = [
  {
    id: 'aiconsult',
    title: 'AiConsult.beauty',
    subtitle: 'Revolutionizing Aesthetic Intelligence',
    description: 'World\'s first platform combining AI analysis with real patient connections. 468-point facial landmark detection meets encrypted peer-to-peer consultations.',
    techStack: ['React 19.1', 'MediaPipe', 'GPT-4', 'E2E Encryption'],
    metrics: [
      { label: 'Facial Points', value: '468' },
      { label: 'Accuracy', value: '99.7%' },
      { label: 'Response Time', value: '0.3s' },
    ],
    icon: <Psychology sx={{ fontSize: 40 }} />,
    gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    featured: true,
    details: [
      'Medical-grade 468-point facial analysis using MediaPipe',
      'First platform connecting patients with verified procedure recipients',
      'End-to-end encrypted messaging with trust verification tiers',
      'Real-time integration with RealSelf patient data',
      'Auto-deleting conversations for privacy protection',
    ],
  },
  {
    id: 'repspheres',
    title: 'RepSpheres Global',
    subtitle: '$753M Market Intelligence Platform',
    description: 'Comprehensive medical sales ecosystem featuring "The Boss" AI assistant with Harvey Specter personality. Multi-tier SaaS platform serving dental and aesthetic industries.',
    techStack: ['React 18', 'Three.js', 'Supabase', 'Stripe', 'GPT-4'],
    metrics: [
      { label: 'Market Size', value: '$753M' },
      { label: 'Data Points', value: '15 Years' },
      { label: 'Pricing Tiers', value: '$49-$1,499' },
    ],
    icon: <ShowChart sx={{ fontSize: 40 }} />,
    gradient: 'linear-gradient(135deg, #00BFFF 0%, #0080FF 100%)',
    featured: true,
    details: [
      'AI chatbot with Harvey Specter personality and glassmorphic design',
      'Multi-tier subscription system with psychological pricing',
      'Real-time market analytics and competitive intelligence',
      'Call recording, transcription, and linguistic analysis',
      'Comprehensive CRM with medical sales optimization',
    ],
  },
  {
    id: 'bodyviz',
    title: 'BodyViz Pro',
    subtitle: 'Medical-Grade Body Transformation',
    description: '3D body reconstruction from single photo using cutting-edge AI. Enterprise platform for medical professionals with blockchain identity verification.',
    techStack: ['Next.js', 'SwiftUI', 'GraphQL', 'Python ML', 'Blockchain'],
    metrics: [
      { label: '3D Accuracy', value: '±2mm' },
      { label: 'Processing', value: '<5s' },
      { label: 'Security', value: 'Zero-Knowledge' },
    ],
    icon: <ThreeDRotation sx={{ fontSize: 40 }} />,
    gradient: 'linear-gradient(135deg, #FFD700 0%, #FF6B6B 100%)',
    featured: true,
    details: [
      '3D body reconstruction from single photograph',
      'Medical-grade transformations for weight loss and procedures',
      'WebAuthn + biometric + blockchain authentication',
      'Zero-knowledge proofs for photo ownership',
      'SMPL fitting and PIFu mesh refinement',
    ],
  },
  {
    id: 'dental-simulator',
    title: 'Dental Implant Simulator',
    subtitle: 'AI-Powered Dental Visualization',
    description: 'Photo-realistic dental implant visualization serving a $10.5B market. HIPAA compliant with NPI-verified doctor authentication.',
    techStack: ['Next.js 15.3', 'TensorFlow.js', 'Canvas API'],
    metrics: [
      { label: 'Market', value: '$10.5B by 2030' },
      { label: 'Users', value: '150M+' },
    ],
    icon: <LocalHospital sx={{ fontSize: 30 }} />,
    gradient: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
    marketSize: '$6.7B (2024) → $10.5B (2030)',
  },
  {
    id: 'edwards',
    title: 'Edwards Dental Platform',
    subtitle: 'AI-Driven Patient Conversion',
    description: 'Sophie AI Assistant using Socratic selling methodology with emotional intelligence and booking intent detection.',
    techStack: ['React 18', 'GPT-4', 'Framer Motion'],
    metrics: [
      { label: 'Intent Detection', value: '0-100%' },
      { label: 'Conversion', value: '+47%' },
    ],
    icon: <Psychology sx={{ fontSize: 30 }} />,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    id: 'supreme',
    title: 'Supreme Sales Dashboard',
    subtitle: 'Collectible-Grade Visualization',
    description: 'Elite 3D gauge cluster with Swiss chronograph-inspired design. Real-time physics animations at 60 FPS.',
    techStack: ['React 19', 'Three.js', 'GSAP', 'React Three Fiber'],
    metrics: [
      { label: 'FPS', value: '60' },
      { label: 'Animations', value: 'Physics-Based' },
    ],
    icon: <ShowChart sx={{ fontSize: 30 }} />,
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    id: 'osbackend',
    title: 'OSBackend',
    subtitle: 'Enterprise Multi-Application Backend',
    description: 'Powers entire RepSpheres ecosystem with multi-LLM support, real-time SSE streaming, and module-based access control.',
    techStack: ['Node.js', 'OpenRouter', 'Whisper', 'Stripe'],
    metrics: [
      { label: 'Confidence', value: '95%' },
      { label: 'APIs', value: 'Multi-LLM' },
    ],
    icon: <CloudQueue sx={{ fontSize: 30 }} />,
    gradient: 'linear-gradient(135deg, #FA8BFF 0%, #2BD2FF 100%)',
  },
  {
    id: 'jenpureskin',
    title: 'JenPureSkin',
    subtitle: 'Medical Spa Platform',
    description: 'Targeting $753M South Florida aesthetics market with AI skincare analyzer and AR consultations.',
    techStack: ['React 19', 'Material-UI', 'AR.js'],
    metrics: [
      { label: 'Market', value: '$753M' },
      { label: 'Features', value: 'AI + AR' },
    ],
    icon: <LocalHospital sx={{ fontSize: 30 }} />,
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  },
  {
    id: 'newsmile',
    title: 'New Smile Guide',
    subtitle: 'Dental Education Platform',
    description: 'Educational platform trusted by 10,000+ dentists worldwide with integrated AI simulator and certification system.',
    techStack: ['React CDN', 'Material UI', 'Analytics'],
    metrics: [
      { label: 'Dentists', value: '10,000+' },
      { label: 'Certifications', value: 'Professional' },
    ],
    icon: <LocalHospital sx={{ fontSize: 30 }} />,
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  },
  {
    id: 'boweryconnect',
    title: 'BoweryConnect',
    subtitle: 'AI Crisis Support for NYC Homeless',
    description: 'Revolutionary platform connecting NYC\'s homeless community with dignity, opportunities, and hope. 24/7 AI-powered crisis support in 5 languages with offline mode.',
    techStack: ['React Native', 'Expo', 'GPT-4', 'Redux Toolkit', 'Netlify'],
    metrics: [
      { label: 'Languages', value: '5' },
      { label: 'Resources', value: '20+' },
      { label: 'Availability', value: '24/7' },
    ],
    icon: <Psychology sx={{ fontSize: 30 }} />,
    gradient: 'linear-gradient(135deg, #4ECDC4 0%, #556270 100%)',
    details: [
      '24/7 AI-powered crisis chatbot trained for homeless mental health',
      'Multi-language support: English, Spanish, Mandarin, Arabic, Russian',
      'Voice recognition for hands-free support',
      'Offline mode with cached crisis responses',
      'Real-time connection to 20+ NYC organizations',
    ],
    liveUrl: 'https://boweryconnect-web.netlify.app',
    githubUrl: 'https://github.com/BoweryJG/BoweryConnect',
  },
];

const techStackIcons: Record<string, React.ReactNode> = {
  'AI/ML': <Psychology />,
  '3D Graphics': <ThreeDRotation />,
  'Security': <Security />,
  'Healthcare': <LocalHospital />,
  'Analytics': <ShowChart />,
  'Cloud': <CloudQueue />,
};

export const Showcase: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const featuredProjects = projects.filter(p => p.featured);
  const gridProjects = projects.filter(p => !p.featured);

  return (
    <Box
      id="showcase"
      sx={{
        py: 12,
        background: 'linear-gradient(180deg, #0a0a0a 0%, #000000 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background effects */}
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: '-10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'float 8s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          right: '-5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(0, 191, 255, 0.1) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'float 10s ease-in-out infinite reverse',
        }}
      />

      <Container maxWidth="lg">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Box textAlign="center" mb={8}>
            <Typography
              variant="caption"
              sx={{
                color: '#FFD700',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                fontFamily: 'monospace',
              }}
            >
              Portfolio
            </Typography>
            <Typography
              variant="h2"
              sx={{
                mt: 2,
                mb: 3,
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 300,
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Transforming Industries Through AI
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: '#C0C0C0',
                fontWeight: 300,
                maxWidth: 700,
                mx: 'auto',
              }}
            >
              From medical intelligence platforms to enterprise AI solutions, 
              explore how we've revolutionized industries with cutting-edge technology
            </Typography>
          </Box>
        </motion.div>

        {/* Featured projects */}
        <Box mb={8}>
          <Typography
            variant="h4"
            sx={{
              mb: 4,
              color: '#F8F8FF',
              fontWeight: 300,
              textAlign: 'center',
            }}
          >
            Featured Case Studies
          </Typography>
          <Grid container spacing={4}>
            {featuredProjects.map((project, index) => (
              <Grid item xs={12} md={4} key={project.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  onHoverStart={() => setHoveredCard(project.id)}
                  onHoverEnd={() => setHoveredCard(null)}
                >
                  <Card
                    sx={{
                      height: '100%',
                      background: alpha('#1a1a1a', 0.5),
                      backdropFilter: 'blur(20px)',
                      border: '1px solid',
                      borderColor: alpha('#FFD700', 0.2),
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: alpha('#FFD700', 0.5),
                        boxShadow: `0 20px 40px ${alpha('#FFD700', 0.1)}`,
                      },
                    }}
                    onClick={() => setSelectedProject(project)}
                  >
                    {/* Gradient overlay */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: project.gradient,
                        opacity: hoveredCard === project.id ? 1 : 0.7,
                        transition: 'opacity 0.3s ease',
                      }}
                    />

                    <CardContent sx={{ p: 4 }}>
                      <Box display="flex" alignItems="center" mb={3}>
                        <Box
                          sx={{
                            background: project.gradient,
                            borderRadius: '12px',
                            p: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2,
                          }}
                        >
                          {React.cloneElement(project.icon as React.ReactElement, {
                            sx: { color: '#000', fontSize: 40 },
                          })}
                        </Box>
                        <Box>
                          <Typography
                            variant="h5"
                            sx={{
                              color: '#F8F8FF',
                              fontWeight: 500,
                              mb: 0.5,
                            }}
                          >
                            {project.title}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: '#FFD700',
                              fontWeight: 500,
                              textTransform: 'uppercase',
                              letterSpacing: '0.1em',
                            }}
                          >
                            {project.subtitle}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography
                        variant="body1"
                        sx={{
                          color: '#C0C0C0',
                          mb: 3,
                          minHeight: 80,
                        }}
                      >
                        {project.description}
                      </Typography>

                      {/* Metrics */}
                      <Grid container spacing={2} mb={3}>
                        {project.metrics.map((metric, idx) => (
                          <Grid item xs={4} key={idx}>
                            <Box textAlign="center">
                              <Typography
                                variant="h6"
                                sx={{
                                  color: '#FFD700',
                                  fontFamily: 'monospace',
                                  fontWeight: 600,
                                }}
                              >
                                {metric.value}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: '#808080',
                                  fontSize: '0.7rem',
                                }}
                              >
                                {metric.label}
                              </Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>

                      {/* Tech stack */}
                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {project.techStack.map((tech, idx) => (
                          <Chip
                            key={idx}
                            label={tech}
                            size="small"
                            sx={{
                              background: alpha('#FFD700', 0.1),
                              borderColor: alpha('#FFD700', 0.3),
                              color: '#FFD700',
                              fontSize: '0.75rem',
                              height: 24,
                            }}
                            variant="outlined"
                          />
                        ))}
                      </Box>

                      <Box
                        sx={{
                          mt: 3,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Button
                          endIcon={<Visibility />}
                          sx={{
                            color: '#FFD700',
                            textTransform: 'none',
                            '&:hover': {
                              background: alpha('#FFD700', 0.1),
                            },
                          }}
                        >
                          View Case Study
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Project grid */}
        <Box>
          <Typography
            variant="h4"
            sx={{
              mb: 4,
              color: '#F8F8FF',
              fontWeight: 300,
              textAlign: 'center',
            }}
          >
            Additional Projects
          </Typography>
          <Grid container spacing={3}>
            {gridProjects.map((project, index) => (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      background: alpha('#1a1a1a', 0.3),
                      backdropFilter: 'blur(10px)',
                      border: '1px solid',
                      borderColor: alpha('#FFD700', 0.1),
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: alpha('#FFD700', 0.3),
                        background: alpha('#1a1a1a', 0.5),
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{
                          background: project.gradient,
                          borderRadius: '8px',
                          p: 1,
                          display: 'inline-flex',
                          mb: 2,
                        }}
                      >
                        {React.cloneElement(project.icon as React.ReactElement, {
                          sx: { color: '#000', fontSize: 24 },
                        })}
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          color: '#F8F8FF',
                          mb: 1,
                        }}
                      >
                        {project.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#FFD700',
                          display: 'block',
                          mb: 2,
                        }}
                      >
                        {project.subtitle}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#999',
                          mb: 2,
                          minHeight: 60,
                        }}
                      >
                        {project.description}
                      </Typography>
                      {project.marketSize && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#00BFFF',
                            fontFamily: 'monospace',
                          }}
                        >
                          {project.marketSize}
                        </Typography>
                      )}
                      {(project.liveUrl || project.githubUrl) && (
                        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                          {project.liveUrl && (
                            <Button
                              size="small"
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                color: '#FFD700',
                                fontSize: '0.8rem',
                                textTransform: 'none',
                                '&:hover': {
                                  background: alpha('#FFD700', 0.1),
                                },
                              }}
                            >
                              View Live
                            </Button>
                          )}
                          {project.githubUrl && (
                            <Button
                              size="small"
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                color: '#FFD700',
                                fontSize: '0.8rem',
                                textTransform: 'none',
                                '&:hover': {
                                  background: alpha('#FFD700', 0.1),
                                },
                              }}
                            >
                              GitHub
                            </Button>
                          )}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Technical excellence bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Box
            sx={{
              mt: 10,
              p: 4,
              background: alpha('#1a1a1a', 0.3),
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
              border: '1px solid',
              borderColor: alpha('#FFD700', 0.2),
            }}
          >
            <Typography
              variant="h5"
              textAlign="center"
              sx={{
                mb: 4,
                color: '#F8F8FF',
                fontWeight: 300,
              }}
            >
              Technical Excellence
            </Typography>
            <Grid container spacing={3}>
              {Object.entries({
                'AI/ML': 'GPT-4, Claude, MediaPipe, TensorFlow.js',
                '3D Graphics': 'Three.js, React Three Fiber, GSAP',
                'Security': 'WebAuthn, Blockchain, Zero-knowledge proofs',
                'Healthcare': 'HIPAA Compliance, NPI Verification, Medical-grade accuracy',
                'Analytics': 'Real-time SSE, WebSocket, Data visualization',
                'Cloud': 'Node.js, GraphQL, Supabase, Stripe, Serverless',
              }).map(([category, techs]) => (
                <Grid item xs={12} sm={6} md={4} key={category}>
                  <Box display="flex" alignItems="flex-start">
                    <Box
                      sx={{
                        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                        borderRadius: '8px',
                        p: 1,
                        mr: 2,
                      }}
                    >
                      {React.cloneElement(techStackIcons[category] as React.ReactElement, {
                        sx: { color: '#000', fontSize: 24 },
                      })}
                    </Box>
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: '#FFD700',
                          fontWeight: 500,
                          mb: 0.5,
                        }}
                      >
                        {category}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#999',
                          lineHeight: 1.6,
                        }}
                      >
                        {techs}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.div>
      </Container>

      {/* Project detail dialog */}
      <Dialog
        open={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: '#0a0a0a',
            backdropFilter: 'blur(20px)',
            border: '1px solid',
            borderColor: alpha('#FFD700', 0.2),
          },
        }}
      >
        {selectedProject && (
          <DialogContent sx={{ p: 0 }}>
            <Box
              sx={{
                background: selectedProject.gradient,
                p: 4,
                position: 'relative',
              }}
            >
              <IconButton
                onClick={() => setSelectedProject(null)}
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  color: '#000',
                }}
              >
                <Close />
              </IconButton>
              <Box display="flex" alignItems="center">
                <Box
                  sx={{
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: '12px',
                    p: 2,
                    mr: 3,
                  }}
                >
                  {React.cloneElement(selectedProject.icon as React.ReactElement, {
                    sx: { color: '#fff', fontSize: 48 },
                  })}
                </Box>
                <Box>
                  <Typography
                    variant="h4"
                    sx={{
                      color: '#000',
                      fontWeight: 600,
                      mb: 1,
                    }}
                  >
                    {selectedProject.title}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'rgba(0,0,0,0.7)',
                    }}
                  >
                    {selectedProject.subtitle}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box p={4}>
              <Typography
                variant="body1"
                sx={{
                  color: '#C0C0C0',
                  mb: 4,
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                }}
              >
                {selectedProject.description}
              </Typography>

              {selectedProject.details && (
                <Box mb={4}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#FFD700',
                      mb: 2,
                    }}
                  >
                    Key Features
                  </Typography>
                  <Box component="ul" sx={{ pl: 3 }}>
                    {selectedProject.details.map((detail, idx) => (
                      <Typography
                        key={idx}
                        component="li"
                        variant="body2"
                        sx={{
                          color: '#999',
                          mb: 1,
                          lineHeight: 1.8,
                        }}
                      >
                        {detail}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              )}

              <Box mb={4}>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#FFD700',
                    mb: 2,
                  }}
                >
                  Performance Metrics
                </Typography>
                <Grid container spacing={3}>
                  {selectedProject.metrics.map((metric, idx) => (
                    <Grid item xs={4} key={idx}>
                      <Box
                        sx={{
                          p: 2,
                          background: alpha('#FFD700', 0.05),
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: alpha('#FFD700', 0.2),
                          textAlign: 'center',
                        }}
                      >
                        <Typography
                          variant="h5"
                          sx={{
                            color: '#FFD700',
                            fontFamily: 'monospace',
                            fontWeight: 600,
                            mb: 0.5,
                          }}
                        >
                          {metric.value}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#808080',
                          }}
                        >
                          {metric.label}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#FFD700',
                    mb: 2,
                  }}
                >
                  Technology Stack
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1.5}>
                  {selectedProject.techStack.map((tech, idx) => (
                    <Chip
                      key={idx}
                      label={tech}
                      sx={{
                        background: alpha('#FFD700', 0.1),
                        borderColor: alpha('#FFD700', 0.3),
                        color: '#FFD700',
                        fontSize: '0.875rem',
                      }}
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </DialogContent>
        )}
      </Dialog>
    </Box>
  );
};