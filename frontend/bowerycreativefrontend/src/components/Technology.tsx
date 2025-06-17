import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  alpha,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Code,
  Storage,
  Cloud,
  Security,
  Speed,
  Psychology,
  Memory,
  Api,
  DataObject,
  Hub,
  Architecture,
} from '@mui/icons-material';

interface TechCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  technologies: Technology[];
}

interface Technology {
  name: string;
  level: number;
  description: string;
  projects?: string[];
}

const techCategories: TechCategory[] = [
  {
    id: 'frontend',
    title: 'Frontend Excellence',
    icon: <Code />,
    color: '#FFD700',
    technologies: [
      {
        name: 'React 19 / Next.js 15',
        level: 98,
        description: 'Building cutting-edge interfaces with the latest frameworks',
        projects: ['AiConsult.beauty', 'RepSpheres', 'BodyViz Pro'],
      },
      {
        name: 'TypeScript',
        level: 95,
        description: 'Type-safe development for enterprise reliability',
        projects: ['All Projects'],
      },
      {
        name: 'Three.js / React Three Fiber',
        level: 92,
        description: '3D visualizations and immersive experiences',
        projects: ['Supreme Dashboard', 'RepSpheres'],
      },
      {
        name: 'Framer Motion / GSAP',
        level: 90,
        description: 'Smooth, physics-based animations',
        projects: ['Edwards Dental', 'Bowery Creative'],
      },
    ],
  },
  {
    id: 'backend',
    title: 'Backend Architecture',
    icon: <Storage />,
    color: '#00BFFF',
    technologies: [
      {
        name: 'Node.js / Express',
        level: 96,
        description: 'Scalable server-side applications',
        projects: ['OSBackend', 'RepSpheres API'],
      },
      {
        name: 'GraphQL / REST APIs',
        level: 94,
        description: 'Efficient data fetching and API design',
        projects: ['BodyViz Pro', 'AiConsult.beauty'],
      },
      {
        name: 'Supabase / PostgreSQL',
        level: 92,
        description: 'Real-time databases and authentication',
        projects: ['RepSpheres', 'AiConsult.beauty'],
      },
      {
        name: 'Serverless / Edge Functions',
        level: 88,
        description: 'Global deployment with zero cold starts',
        projects: ['All SaaS Platforms'],
      },
    ],
  },
  {
    id: 'ai',
    title: 'AI & Machine Learning',
    icon: <Psychology />,
    color: '#FF6B6B',
    technologies: [
      {
        name: 'OpenAI GPT-4 / Claude',
        level: 97,
        description: 'Advanced language models for intelligent features',
        projects: ['The Boss AI', 'Sophie AI', 'AiConsult'],
      },
      {
        name: 'MediaPipe / TensorFlow.js',
        level: 93,
        description: 'Client-side ML for real-time analysis',
        projects: ['AiConsult.beauty', 'Dental Simulator'],
      },
      {
        name: 'Vector Databases',
        level: 89,
        description: 'Semantic search and AI memory systems',
        projects: ['RepSpheres Intelligence'],
      },
      {
        name: 'Custom ML Pipelines',
        level: 85,
        description: 'Python-based processing for specialized tasks',
        projects: ['BodyViz Pro'],
      },
    ],
  },
  {
    id: 'security',
    title: 'Security & Authentication',
    icon: <Security />,
    color: '#4ECDC4',
    technologies: [
      {
        name: 'WebAuthn / Biometrics',
        level: 94,
        description: 'Passwordless authentication systems',
        projects: ['BodyViz Pro', 'Medical Platforms'],
      },
      {
        name: 'Zero-Knowledge Proofs',
        level: 91,
        description: 'Privacy-preserving verification',
        projects: ['BodyViz Pro'],
      },
      {
        name: 'E2E Encryption',
        level: 96,
        description: 'Secure messaging and data protection',
        projects: ['AiConsult.beauty'],
      },
      {
        name: 'Blockchain Identity',
        level: 87,
        description: 'Decentralized identity verification',
        projects: ['BodyViz Pro'],
      },
    ],
  },
  {
    id: 'infrastructure',
    title: 'Cloud Infrastructure',
    icon: <Cloud />,
    color: '#9B59B6',
    technologies: [
      {
        name: 'AWS / Vercel / Netlify',
        level: 95,
        description: 'Multi-cloud deployment strategies',
        projects: ['All Projects'],
      },
      {
        name: 'Docker / Kubernetes',
        level: 88,
        description: 'Containerized microservices',
        projects: ['Enterprise Solutions'],
      },
      {
        name: 'CI/CD Pipelines',
        level: 92,
        description: 'Automated testing and deployment',
        projects: ['All Projects'],
      },
      {
        name: 'Monitoring & Analytics',
        level: 90,
        description: 'Real-time performance tracking',
        projects: ['Production Systems'],
      },
    ],
  },
  {
    id: 'mobile',
    title: 'Mobile Development',
    icon: <Memory />,
    color: '#E74C3C',
    technologies: [
      {
        name: 'SwiftUI / iOS',
        level: 91,
        description: 'Native iOS applications',
        projects: ['BodyViz Pro iOS'],
      },
      {
        name: 'React Native',
        level: 87,
        description: 'Cross-platform mobile apps',
        projects: ['Healthcare Apps'],
      },
      {
        name: 'PWA Technologies',
        level: 93,
        description: 'Progressive web applications',
        projects: ['All Web Platforms'],
      },
      {
        name: 'Mobile Optimization',
        level: 95,
        description: '60 FPS performance on all devices',
        projects: ['Supreme Dashboard'],
      },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export const Technology: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

  return (
    <Box
      id="technology"
      sx={{
        py: 12,
        background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background grid */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255, 215, 0, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 215, 0, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-move 20s linear infinite',
          '@keyframes grid-move': {
            '0%': { transform: 'translate(0, 0)' },
            '100%': { transform: 'translate(50px, 50px)' },
          },
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
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
              Technology Stack
            </Typography>
            <Typography
              variant="h2"
              sx={{
                mt: 2,
                mb: 3,
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 300,
                background: 'linear-gradient(135deg, #FFD700 0%, #00BFFF 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Engineering at Scale
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
              Mastery across the full technology spectrum, from cutting-edge AI 
              to bulletproof infrastructure
            </Typography>
          </Box>
        </motion.div>

        {/* Category selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: { xs: 1, sm: 2 },
              justifyContent: 'center',
              mb: 6,
              px: { xs: 1, sm: 0 },
            }}
          >
            {techCategories.map((category) => (
              <motion.div
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Chip
                  label={category.title}
                  icon={React.cloneElement(category.icon as React.ReactElement, {
                    sx: { fontSize: { xs: 18, sm: 20 } },
                  })}
                  onClick={() => setSelectedCategory(
                    selectedCategory === category.id ? null : category.id
                  )}
                  sx={{
                    px: { xs: 1.5, sm: 2 },
                    py: { xs: 2.5, sm: 3 },
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    background: selectedCategory === category.id
                      ? `linear-gradient(135deg, ${category.color} 0%, ${alpha(category.color, 0.7)} 100%)`
                      : alpha('#1a1a1a', 0.5),
                    backdropFilter: 'blur(10px)',
                    border: '1px solid',
                    borderColor: selectedCategory === category.id
                      ? category.color
                      : alpha('#FFD700', 0.2),
                    color: selectedCategory === category.id ? '#000' : '#F8F8FF',
                    fontWeight: selectedCategory === category.id ? 600 : 400,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '& .MuiChip-icon': {
                      color: selectedCategory === category.id ? '#000' : category.color,
                    },
                    '&:hover': {
                      borderColor: category.color,
                      background: selectedCategory === category.id
                        ? `linear-gradient(135deg, ${category.color} 0%, ${alpha(category.color, 0.7)} 100%)`
                        : alpha(category.color, 0.1),
                    },
                  }}
                />
              </motion.div>
            ))}
          </Box>
        </motion.div>

        {/* Technology cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Grid container spacing={4}>
            {techCategories
              .filter(cat => !selectedCategory || cat.id === selectedCategory)
              .map((category) => (
                <Grid item xs={12} key={category.id}>
                  <motion.div variants={itemVariants}>
                    <Card
                      sx={{
                        background: alpha('#1a1a1a', 0.3),
                        backdropFilter: 'blur(20px)',
                        border: '1px solid',
                        borderColor: alpha(category.color, 0.2),
                        borderRadius: 3,
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      {/* Category header */}
                      <Box
                        sx={{
                          p: { xs: 2, sm: 3 },
                          background: `linear-gradient(135deg, ${alpha(category.color, 0.1)} 0%, transparent 100%)`,
                          borderBottom: '1px solid',
                          borderColor: alpha(category.color, 0.2),
                        }}
                      >
                        <Box display="flex" alignItems="center" gap={2}>
                          <Box
                            sx={{
                              background: `linear-gradient(135deg, ${category.color} 0%, ${alpha(category.color, 0.7)} 100%)`,
                              borderRadius: '12px',
                              p: 1.5,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {React.cloneElement(category.icon as React.ReactElement, {
                              sx: { color: '#000', fontSize: 28 },
                            })}
                          </Box>
                          <Typography
                            variant="h5"
                            sx={{
                              color: '#F8F8FF',
                              fontWeight: 500,
                              fontSize: { xs: '1.25rem', sm: '1.5rem' },
                            }}
                          >
                            {category.title}
                          </Typography>
                        </Box>
                      </Box>

                      <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                        <Grid container spacing={{ xs: 2, sm: 3 }}>
                          {category.technologies.map((tech, index) => (
                            <Grid item xs={12} md={6} key={tech.name}>
                              <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                onHoverStart={() => setHoveredTech(tech.name)}
                                onHoverEnd={() => setHoveredTech(null)}
                              >
                                <Box
                                  sx={{
                                    p: { xs: 2, sm: 3 },
                                    background: hoveredTech === tech.name
                                      ? alpha(category.color, 0.05)
                                      : 'transparent',
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: hoveredTech === tech.name
                                      ? alpha(category.color, 0.3)
                                      : 'transparent',
                                    transition: 'all 0.3s ease',
                                  }}
                                >
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      color: '#F8F8FF',
                                      mb: 1,
                                      fontWeight: 500,
                                      fontSize: { xs: '1rem', sm: '1.25rem' },
                                    }}
                                  >
                                    {tech.name}
                                  </Typography>
                                  
                                  <Box sx={{ mb: 2 }}>
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        mb: 1,
                                      }}
                                    >
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          color: '#999',
                                          textTransform: 'uppercase',
                                          letterSpacing: '0.1em',
                                          fontSize: { xs: '0.65rem', sm: '0.75rem' },
                                        }}
                                      >
                                        Proficiency
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          color: category.color,
                                          fontFamily: 'monospace',
                                          fontWeight: 600,
                                          fontSize: { xs: '0.65rem', sm: '0.75rem' },
                                        }}
                                      >
                                        {tech.level}%
                                      </Typography>
                                    </Box>
                                    <LinearProgress
                                      variant="determinate"
                                      value={tech.level}
                                      sx={{
                                        height: 6,
                                        borderRadius: 3,
                                        backgroundColor: alpha(category.color, 0.1),
                                        '& .MuiLinearProgress-bar': {
                                          borderRadius: 3,
                                          background: `linear-gradient(90deg, ${category.color} 0%, ${alpha(category.color, 0.7)} 100%)`,
                                        },
                                      }}
                                    />
                                  </Box>

                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: '#C0C0C0',
                                      mb: 2,
                                      lineHeight: 1.6,
                                    }}
                                  >
                                    {tech.description}
                                  </Typography>

                                  {tech.projects && (
                                    <Box display="flex" flexWrap="wrap" gap={1}>
                                      {tech.projects.map((project) => (
                                        <Chip
                                          key={project}
                                          label={project}
                                          size="small"
                                          sx={{
                                            background: alpha(category.color, 0.1),
                                            borderColor: alpha(category.color, 0.3),
                                            color: category.color,
                                            fontSize: '0.7rem',
                                            height: 22,
                                          }}
                                          variant="outlined"
                                        />
                                      ))}
                                    </Box>
                                  )}
                                </Box>
                              </motion.div>
                            </Grid>
                          ))}
                        </Grid>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
          </Grid>
        </motion.div>

        {/* Architecture diagram */}
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
              textAlign: 'center',
            }}
          >
            <Architecture
              sx={{
                fontSize: 48,
                color: '#FFD700',
                mb: 3,
              }}
            />
            <Typography
              variant="h5"
              sx={{
                color: '#F8F8FF',
                mb: 2,
                fontWeight: 300,
              }}
            >
              Enterprise Architecture
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#C0C0C0',
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.8,
              }}
            >
              Every solution is built with scalability, security, and performance at its core. 
              From microservices to monoliths, we choose the right architecture for your needs.
            </Typography>
            
            <Grid container spacing={3} sx={{ mt: 4 }}>
              {[
                { icon: <Api />, label: '500M+', desc: 'API Calls Handled' },
                { icon: <Speed />, label: '<50ms', desc: 'Average Response Time' },
                { icon: <Hub />, label: '99.99%', desc: 'Uptime SLA' },
                { icon: <DataObject />, label: 'Petabyte', desc: 'Scale Data Processing' },
              ].map((stat, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <Box
                    sx={{
                      p: 3,
                      background: alpha('#FFD700', 0.05),
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: alpha('#FFD700', 0.2),
                    }}
                  >
                    {React.cloneElement(stat.icon, {
                      sx: { fontSize: 32, color: '#FFD700', mb: 2 },
                    })}
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#FFD700',
                        fontFamily: 'monospace',
                        fontWeight: 600,
                        mb: 0.5,
                      }}
                    >
                      {stat.label}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#808080',
                        display: 'block',
                      }}
                    >
                      {stat.desc}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};