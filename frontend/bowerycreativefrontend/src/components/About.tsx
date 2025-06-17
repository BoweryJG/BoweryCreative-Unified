import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Button,
  alpha,
} from '@mui/material';
import {
  LinkedIn,
  GitHub,
  Email,
  TrendingUp,
  LocalHospital,
  Psychology,
  Rocket,
  AutoAwesome,
  EmojiEvents,
  Timeline,
  ArrowForward,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  stats?: string;
}

const achievements: Achievement[] = [
  {
    id: 'coolsculpting',
    title: 'CoolSculpting Founding Team',
    description: 'Pioneered the launch of revolutionary fat-freezing technology across the Northeastern United States, establishing market dominance in aesthetic medicine.',
    icon: <LocalHospital />,
    gradient: 'linear-gradient(135deg, #00BFFF 0%, #0080FF 100%)',
    stats: 'Northeast Region Launch',
  },
  {
    id: 'neocis',
    title: 'Advanced Surgical Robotics',
    description: 'Regional sales leadership for Neocis surgical robotics systems, bringing AI-powered dental implant technology to the New York market.',
    icon: <Psychology />,
    gradient: 'linear-gradient(135deg, #76B900 0%, #00D4AA 100%)',
    stats: 'NY Market Leader',
  },
  {
    id: 'medtech',
    title: 'Medical Technology Pioneer',
    description: 'Decades of experience launching cutting-edge medical technologies, from aesthetic devices to surgical systems, with proven market success.',
    icon: <Rocket />,
    gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    stats: '15+ Years Experience',
  },
  {
    id: 'ai-luxury',
    title: 'AI + Luxury Innovation',
    description: 'Combining deep medical tech expertise with AI innovation to create unprecedented digital experiences for luxury brands and healthcare leaders.',
    icon: <AutoAwesome />,
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
    stats: 'Next-Gen Solutions',
  },
];

interface TimelineItem {
  year: string;
  title: string;
  company: string;
  description: string;
  highlight?: boolean;
}

const timeline: TimelineItem[] = [
  {
    year: '2024',
    title: 'Founder & CEO',
    company: 'Bowery Creative',
    description: 'Launching AI-powered luxury experiences for elite brands',
    highlight: true,
  },
  {
    year: '2020-2023',
    title: 'Regional Sales Manager',
    company: 'Neocis',
    description: 'New York market leadership for AI-guided dental implant systems',
    highlight: true,
  },
  {
    year: '2010-2019',
    title: 'Medical Technology Pioneer',
    company: 'Various Startups',
    description: 'Launching breakthrough aesthetic & medical devices',
  },
  {
    year: '2008',
    title: 'Founding Team Member',
    company: 'CoolSculpting',
    description: 'Regional launch of revolutionary fat-freezing technology',
    highlight: true,
  },
];

export const About: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <Box
      id="about"
      sx={{
        py: 12,
        background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '-5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(255, 215, 0, 0.05) 0%, transparent 60%)',
          filter: 'blur(100px)',
          animation: 'float 20s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          right: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(0, 191, 255, 0.05) 0%, transparent 60%)',
          filter: 'blur(120px)',
          animation: 'float 25s ease-in-out infinite reverse',
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
              The Vision
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
              Medical Innovation Meets AI Excellence
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: '#C0C0C0',
                fontWeight: 300,
                maxWidth: 800,
                mx: 'auto',
              }}
            >
              From pioneering CoolSculpting's regional launch to leading surgical robotics sales in New York, 
              now bringing that same market expertise to luxury AI experiences
            </Typography>
          </Box>
        </motion.div>

        {/* Founder profile */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card
            sx={{
              background: alpha('#1a1a1a', 0.5),
              backdropFilter: 'blur(20px)',
              border: '1px solid',
              borderColor: alpha('#FFD700', 0.2),
              borderRadius: 3,
              overflow: 'hidden',
              mb: 8,
            }}
          >
            <CardContent sx={{ p: { xs: 4, md: 6 } }}>
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Typography
                    variant="h3"
                    sx={{
                      color: '#F8F8FF',
                      fontWeight: 500,
                      mb: 2,
                      fontSize: { xs: '2rem', md: '3rem' },
                    }}
                  >
                    Jason William Golden
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: '#FFD700',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      fontSize: '1.2rem',
                      mb: 3,
                    }}
                  >
                    Founder & Visionary
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#C0C0C0',
                      lineHeight: 1.8,
                      fontSize: '1.1rem',
                      mb: 4,
                    }}
                  >
                    A pioneer at the intersection of medical technology and artificial intelligence. 
                    From launching revolutionary aesthetic technologies to developing AI-powered surgical systems, 
                    Jason brings decades of innovation expertise to every project. His unique background 
                    spans the entire journey from founding team member at CoolSculpting to leading 
                    innovation at NVIDIA-backed surgical robotics company Neocis.
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={2} mb={4}>
                    <Chip
                      icon={<EmojiEvents sx={{ color: '#FFD700 !important' }} />}
                      label="CoolSculpting Founding Team"
                      sx={{
                        background: alpha('#FFD700', 0.1),
                        borderColor: alpha('#FFD700', 0.3),
                        color: '#FFD700',
                        fontSize: '0.875rem',
                        py: 2,
                        px: 1,
                      }}
                      variant="outlined"
                    />
                    <Chip
                      icon={<Psychology sx={{ color: '#00BFFF !important' }} />}
                      label="NVIDIA-Backed Innovation"
                      sx={{
                        background: alpha('#00BFFF', 0.1),
                        borderColor: alpha('#00BFFF', 0.3),
                        color: '#00BFFF',
                        fontSize: '0.875rem',
                        py: 2,
                        px: 1,
                      }}
                      variant="outlined"
                    />
                    <Chip
                      icon={<Rocket sx={{ color: '#FF6B6B !important' }} />}
                      label="15+ Years MedTech"
                      sx={{
                        background: alpha('#FF6B6B', 0.1),
                        borderColor: alpha('#FF6B6B', 0.3),
                        color: '#FF6B6B',
                        fontSize: '0.875rem',
                        py: 2,
                        px: 1,
                      }}
                      variant="outlined"
                    />
                  </Box>
                  <Box display="flex" gap={2}>
                    <IconButton
                      href="https://www.linkedin.com/in/jasonwilliamgolden/"
                      target="_blank"
                      sx={{
                        color: '#808080',
                        background: alpha('#1a1a1a', 0.5),
                        '&:hover': {
                          color: '#FFD700',
                          background: alpha('#FFD700', 0.1),
                        },
                      }}
                    >
                      <LinkedIn />
                    </IconButton>
                    <IconButton
                      href="mailto:jason@bowery.ai"
                      sx={{
                        color: '#808080',
                        background: alpha('#1a1a1a', 0.5),
                        '&:hover': {
                          color: '#FFD700',
                          background: alpha('#FFD700', 0.1),
                        },
                      }}
                    >
                      <Email />
                    </IconButton>
                    <IconButton
                      sx={{
                        color: '#808080',
                        background: alpha('#1a1a1a', 0.5),
                        '&:hover': {
                          color: '#FFD700',
                          background: alpha('#FFD700', 0.1),
                        },
                      }}
                    >
                      <GitHub />
                    </IconButton>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box
                    sx={{
                      position: 'relative',
                      aspectRatio: '1',
                      background: 'linear-gradient(135deg, #FFD700 0%, #00BFFF 100%)',
                      borderRadius: 3,
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 2,
                        background: '#0a0a0a',
                        borderRadius: 3,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1,
                      }}
                    >
                      <TrendingUp sx={{ fontSize: 120, color: '#FFD700', opacity: 0.3 }} />
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </motion.div>

        {/* Key achievements */}
        <Typography
          variant="h4"
          sx={{
            textAlign: 'center',
            color: '#F8F8FF',
            fontWeight: 300,
            mb: 6,
          }}
        >
          Pioneering Achievements
        </Typography>
        <Grid container spacing={4} mb={8}>
          {achievements.map((achievement, index) => (
            <Grid item xs={12} sm={6} lg={3} key={achievement.id}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                onHoverStart={() => setHoveredCard(achievement.id)}
                onHoverEnd={() => setHoveredCard(null)}
              >
                <Card
                  sx={{
                    height: '100%',
                    background: alpha('#1a1a1a', 0.3),
                    backdropFilter: 'blur(10px)',
                    border: '1px solid',
                    borderColor: hoveredCard === achievement.id
                      ? alpha('#FFD700', 0.5)
                      : alpha('#FFD700', 0.1),
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '12px',
                        background: achievement.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                        boxShadow: hoveredCard === achievement.id
                          ? `0 8px 32px ${alpha('#FFD700', 0.4)}`
                          : 'none',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {React.cloneElement(achievement.icon as React.ReactElement, {
                        sx: { color: '#000', fontSize: 32 },
                      })}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#F8F8FF',
                        fontWeight: 500,
                        mb: 2,
                      }}
                    >
                      {achievement.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#C0C0C0',
                        lineHeight: 1.6,
                        mb: 2,
                      }}
                    >
                      {achievement.description}
                    </Typography>
                    {achievement.stats && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#FFD700',
                          fontFamily: 'monospace',
                          fontWeight: 600,
                        }}
                      >
                        {achievement.stats}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Box
            sx={{
              p: { xs: 4, md: 6 },
              background: alpha('#1a1a1a', 0.3),
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
              border: '1px solid',
              borderColor: alpha('#FFD700', 0.2),
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="center" mb={4}>
              <Timeline sx={{ fontSize: 40, color: '#FFD700', mr: 2 }} />
              <Typography
                variant="h4"
                sx={{
                  color: '#F8F8FF',
                  fontWeight: 300,
                }}
              >
                Journey of Innovation
              </Typography>
            </Box>
            <Box sx={{ position: 'relative' }}>
              {/* Timeline line */}
              <Box
                sx={{
                  position: 'absolute',
                  left: { xs: 20, md: '50%' },
                  top: 0,
                  bottom: 0,
                  width: 2,
                  background: alpha('#FFD700', 0.2),
                  transform: { md: 'translateX(-50%)' },
                }}
              />
              {timeline.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    mb: 4,
                    position: 'relative',
                    flexDirection: { xs: 'row', md: index % 2 === 0 ? 'row' : 'row-reverse' },
                    alignItems: 'center',
                  }}
                >
                  {/* Year bubble */}
                  <Box
                    sx={{
                      position: { xs: 'absolute', md: 'relative' },
                      left: { xs: 0, md: 'auto' },
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: item.highlight ? '#FFD700' : alpha('#FFD700', 0.2),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 2,
                      mx: { md: 'auto' },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: item.highlight ? '#000' : '#FFD700',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                      }}
                    >
                      {item.year.slice(-2)}
                    </Typography>
                  </Box>
                  {/* Content */}
                  <Box
                    sx={{
                      flex: 1,
                      ml: { xs: 8, md: 0 },
                      px: { md: 4 },
                      textAlign: { md: index % 2 === 0 ? 'right' : 'left' },
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#F8F8FF',
                        fontWeight: 500,
                        mb: 0.5,
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: '#FFD700',
                        fontWeight: 500,
                        mb: 1,
                      }}
                    >
                      {item.company}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#999',
                      }}
                    >
                      {item.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </motion.div>

        {/* Vision statement */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Box
            sx={{
              mt: 8,
              p: { xs: 4, md: 6 },
              textAlign: 'center',
              background: `linear-gradient(135deg, ${alpha('#FFD700', 0.1)} 0%, ${alpha('#00BFFF', 0.1)} 100%)`,
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
              border: '1px solid',
              borderColor: alpha('#FFD700', 0.2),
            }}
          >
            <AutoAwesome
              sx={{
                fontSize: 48,
                color: '#FFD700',
                mb: 3,
              }}
            />
            <Typography
              variant="h4"
              sx={{
                color: '#F8F8FF',
                mb: 2,
                fontWeight: 300,
              }}
            >
              The Future is Intelligent Luxury
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#C0C0C0',
                mb: 4,
                maxWidth: 700,
                mx: 'auto',
                lineHeight: 1.8,
              }}
            >
              Bringing the precision of medical technology to the world of AI and luxury experiences. 
              Every project combines decades of innovation expertise with cutting-edge artificial intelligence 
              to create solutions that don't just meet expectations—they redefine them.
            </Typography>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              href="#contact"
              sx={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                color: '#000',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                '&:hover': {
                  background: 'linear-gradient(135deg, #FFA500 0%, #FFD700 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: `0 10px 30px ${alpha('#FFD700', 0.3)}`,
                },
              }}
            >
              Start Your Journey
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};