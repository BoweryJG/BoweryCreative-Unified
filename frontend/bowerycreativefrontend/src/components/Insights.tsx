import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  alpha,
} from '@mui/material';
import {
  ArrowForward,
  Schedule,
  TrendingUp,
  AutoAwesome,
  Code,
  Psychology,
  Business,
  Security,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  featured?: boolean;
  tags: string[];
  icon: React.ReactNode;
}

const articles: Article[] = [
  {
    id: 'ai-luxury-revolution',
    title: 'The AI Revolution in Luxury: Beyond Personalization',
    excerpt: 'How artificial intelligence is redefining exclusivity and craftsmanship in the luxury sector, from predictive styling to generative design.',
    category: 'AI Strategy',
    readTime: '8 min read',
    date: '2024-01-15',
    image: '/api/placeholder/600/400',
    featured: true,
    tags: ['AI', 'Luxury', 'Innovation'],
    icon: <AutoAwesome />,
  },
  {
    id: 'neural-architecture',
    title: 'Neural Architecture Patterns for Production AI',
    excerpt: 'Deep dive into scalable neural network architectures that power real-time AI applications serving millions of users.',
    category: 'Technical',
    readTime: '12 min read',
    date: '2024-01-10',
    image: '/api/placeholder/600/400',
    featured: true,
    tags: ['Neural Networks', 'Architecture', 'Scale'],
    icon: <Psychology />,
  },
  {
    id: 'roi-ai-implementation',
    title: 'Measuring ROI in Enterprise AI: A Data-Driven Approach',
    excerpt: 'Framework for quantifying the business impact of AI implementations, with case studies showing 3-10x returns.',
    category: 'Business',
    readTime: '10 min read',
    date: '2024-01-05',
    image: '/api/placeholder/600/400',
    featured: true,
    tags: ['ROI', 'Enterprise', 'Metrics'],
    icon: <TrendingUp />,
  },
  {
    id: 'zero-trust-ai',
    title: 'Zero-Trust AI: Security in the Age of LLMs',
    excerpt: 'Building secure AI systems with end-to-end encryption, differential privacy, and adversarial robustness.',
    category: 'Security',
    readTime: '15 min read',
    date: '2023-12-28',
    image: '/api/placeholder/600/400',
    tags: ['Security', 'Privacy', 'LLMs'],
    icon: <Security />,
  },
  {
    id: 'future-interfaces',
    title: 'The Future of Human-AI Interfaces',
    excerpt: 'From conversational AI to neural interfaces: exploring the next decade of human-machine interaction.',
    category: 'Innovation',
    readTime: '6 min read',
    date: '2023-12-20',
    image: '/api/placeholder/600/400',
    tags: ['UX', 'Future', 'Interfaces'],
    icon: <Code />,
  },
  {
    id: 'ai-transformation',
    title: 'Digital Transformation vs AI Transformation',
    excerpt: 'Why traditional digital transformation strategies fail in the AI era and how to build AI-first organizations.',
    category: 'Strategy',
    readTime: '9 min read',
    date: '2023-12-15',
    image: '/api/placeholder/600/400',
    tags: ['Strategy', 'Transformation', 'Leadership'],
    icon: <Business />,
  },
];

const categories = [
  { name: 'All', count: articles.length },
  { name: 'AI Strategy', count: 2 },
  { name: 'Technical', count: 2 },
  { name: 'Business', count: 1 },
  { name: 'Security', count: 1 },
];

export const Insights: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [hoveredArticle, setHoveredArticle] = useState<string | null>(null);

  const filteredArticles = selectedCategory === 'All'
    ? articles
    : articles.filter(article => article.category === selectedCategory);

  const featuredArticles = articles.filter(a => a.featured);
  const regularArticles = filteredArticles.filter(a => !a.featured);

  return (
    <Box
      id="insights"
      sx={{
        py: 12,
        background: 'linear-gradient(180deg, #0a0a0a 0%, #000000 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background gradient orbs */}
      <Box
        sx={{
          position: 'absolute',
          top: '5%',
          right: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(0, 191, 255, 0.08) 0%, transparent 60%)',
          filter: 'blur(100px)',
          animation: 'float 15s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          left: '-5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(255, 215, 0, 0.08) 0%, transparent 60%)',
          filter: 'blur(80px)',
          animation: 'float 20s ease-in-out infinite reverse',
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
              Insights
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
              Thought Leadership
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
              Cutting-edge perspectives on AI, technology, and the future of 
              digital experiences from our team of experts
            </Typography>
          </Box>
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mb: 6,
              overflowX: 'auto',
              pb: 2,
              '&::-webkit-scrollbar': {
                height: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: alpha('#FFD700', 0.3),
                borderRadius: '2px',
              },
            }}
          >
            {categories.map((category) => (
              <Chip
                key={category.name}
                label={`${category.name} (${category.count})`}
                onClick={() => setSelectedCategory(category.name)}
                sx={{
                  px: 3,
                  py: 2.5,
                  fontSize: '0.875rem',
                  background: selectedCategory === category.name
                    ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
                    : alpha('#1a1a1a', 0.5),
                  backdropFilter: 'blur(10px)',
                  border: '1px solid',
                  borderColor: selectedCategory === category.name
                    ? '#FFD700'
                    : alpha('#FFD700', 0.2),
                  color: selectedCategory === category.name ? '#000' : '#F8F8FF',
                  fontWeight: selectedCategory === category.name ? 600 : 400,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: '#FFD700',
                    background: selectedCategory === category.name
                      ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
                      : alpha('#FFD700', 0.1),
                  },
                }}
              />
            ))}
          </Box>
        </motion.div>

        {/* Featured articles */}
        {selectedCategory === 'All' && (
          <Box mb={8}>
            <Typography
              variant="h4"
              sx={{
                mb: 4,
                color: '#F8F8FF',
                fontWeight: 300,
              }}
            >
              Featured Insights
            </Typography>
            <Grid container spacing={4}>
              {featuredArticles.map((article, index) => (
                <Grid item xs={12} md={4} key={article.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10 }}
                    onHoverStart={() => setHoveredArticle(article.id)}
                    onHoverEnd={() => setHoveredArticle(null)}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        background: alpha('#1a1a1a', 0.5),
                        backdropFilter: 'blur(20px)',
                        border: '1px solid',
                        borderColor: alpha('#FFD700', 0.2),
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: alpha('#FFD700', 0.5),
                          boxShadow: `0 20px 40px ${alpha('#FFD700', 0.1)}`,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: 'relative',
                          paddingTop: '66.67%',
                          overflow: 'hidden',
                          background: `linear-gradient(135deg, ${alpha('#FFD700', 0.1)} 0%, ${alpha('#00BFFF', 0.1)} 100%)`,
                        }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {React.cloneElement(article.icon as React.ReactElement, {
                            sx: {
                              fontSize: 80,
                              color: alpha('#FFD700', 0.3),
                              transform: hoveredArticle === article.id ? 'scale(1.1)' : 'scale(1)',
                              transition: 'transform 0.3s ease',
                            },
                          })}
                        </Box>
                      </Box>
                      <CardContent sx={{ p: 4 }}>
                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                          <Chip
                            label={article.category}
                            size="small"
                            sx={{
                              background: alpha('#FFD700', 0.1),
                              borderColor: alpha('#FFD700', 0.3),
                              color: '#FFD700',
                              fontSize: '0.7rem',
                              height: 24,
                            }}
                            variant="outlined"
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              color: '#808080',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                            }}
                          >
                            <Schedule sx={{ fontSize: 14 }} />
                            {article.readTime}
                          </Typography>
                        </Box>
                        <Typography
                          variant="h5"
                          sx={{
                            color: '#F8F8FF',
                            fontWeight: 500,
                            mb: 2,
                            minHeight: 64,
                          }}
                        >
                          {article.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#C0C0C0',
                            mb: 3,
                            lineHeight: 1.8,
                            minHeight: 80,
                          }}
                        >
                          {article.excerpt}
                        </Typography>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography
                            variant="caption"
                            sx={{
                              color: '#808080',
                            }}
                          >
                            {new Date(article.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </Typography>
                          <ArrowForward
                            sx={{
                              color: '#FFD700',
                              fontSize: 20,
                              transform: hoveredArticle === article.id ? 'translateX(5px)' : 'translateX(0)',
                              transition: 'transform 0.3s ease',
                            }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Regular articles grid */}
        <Grid container spacing={3}>
          {(selectedCategory === 'All' ? regularArticles : filteredArticles).map((article, index) => (
            <Grid item xs={12} sm={6} md={4} key={article.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    background: alpha('#1a1a1a', 0.3),
                    backdropFilter: 'blur(10px)',
                    border: '1px solid',
                    borderColor: alpha('#FFD700', 0.1),
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: alpha('#FFD700', 0.3),
                      background: alpha('#1a1a1a', 0.5),
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '8px',
                          background: alpha('#FFD700', 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {React.cloneElement(article.icon as React.ReactElement, {
                          sx: { color: '#FFD700', fontSize: 24 },
                        })}
                      </Box>
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#FFD700',
                            fontWeight: 500,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            display: 'block',
                          }}
                        >
                          {article.category}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#808080',
                          }}
                        >
                          {article.readTime}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#F8F8FF',
                        mb: 2,
                        fontWeight: 500,
                      }}
                    >
                      {article.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#999',
                        mb: 2,
                        lineHeight: 1.6,
                      }}
                    >
                      {article.excerpt}
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {article.tags.slice(0, 2).map((tag) => (
                        <Typography
                          key={tag}
                          variant="caption"
                          sx={{
                            color: '#00BFFF',
                            fontFamily: 'monospace',
                            fontSize: '0.7rem',
                          }}
                        >
                          #{tag}
                        </Typography>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Box
            sx={{
              mt: 10,
              p: { xs: 4, md: 6 },
              background: `linear-gradient(135deg, ${alpha('#FFD700', 0.1)} 0%, ${alpha('#00BFFF', 0.1)} 100%)`,
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
              border: '1px solid',
              borderColor: alpha('#FFD700', 0.2),
              textAlign: 'center',
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
              Stay Ahead of the Curve
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#C0C0C0',
                mb: 4,
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Get exclusive insights on AI, luxury tech, and digital transformation 
              delivered to your inbox. Join 10,000+ industry leaders.
            </Typography>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
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
              Subscribe to Newsletter
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};