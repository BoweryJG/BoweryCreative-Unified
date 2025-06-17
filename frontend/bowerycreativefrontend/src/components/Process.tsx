import React, { useState, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  IconButton,
  alpha,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Architecture,
  Code,
  Rocket,
  Shield,
  TrendingUp,
} from '@mui/icons-material';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ProcessStep {
  id: number;
  phase: string;
  title: string;
  duration: string;
  description: string;
  deliverables: string[];
  icon: React.ReactNode;
  color: string;
}

const processSteps: ProcessStep[] = [
  {
    id: 1,
    phase: 'Discovery',
    title: 'Strategic Vision Alignment',
    duration: '1-2 Weeks',
    description: 'Deep dive into your business objectives, technical requirements, and market positioning. We analyze your competitive landscape and identify opportunities for AI-driven innovation.',
    deliverables: [
      'Technical Requirements Document',
      'Market Opportunity Analysis',
      'AI Integration Strategy',
      'Success Metrics Definition',
    ],
    icon: <Lightbulb />,
    color: '#FFD700',
  },
  {
    id: 2,
    phase: 'Architecture',
    title: 'System Design & Planning',
    duration: '2-3 Weeks',
    description: 'Crafting bulletproof architecture that scales. From microservices to monoliths, we design systems that handle millions of users while maintaining sub-50ms response times.',
    deliverables: [
      'Technical Architecture Blueprint',
      'API Design Specifications',
      'Security & Compliance Framework',
      'Infrastructure Cost Projections',
    ],
    icon: <Architecture />,
    color: '#00BFFF',
  },
  {
    id: 3,
    phase: 'Development',
    title: 'Rapid Iteration & Building',
    duration: '4-12 Weeks',
    description: 'Agile development with weekly deployments. Our team delivers production-ready code with comprehensive testing, documentation, and performance optimization built-in.',
    deliverables: [
      'Weekly Sprint Deliveries',
      'Automated Testing Suite',
      'CI/CD Pipeline Setup',
      'Real-time Progress Dashboard',
    ],
    icon: <Code />,
    color: '#FF6B6B',
  },
  {
    id: 4,
    phase: 'Launch',
    title: 'Deployment & Optimization',
    duration: '1-2 Weeks',
    description: 'Zero-downtime deployment with comprehensive monitoring. We ensure your application launches flawlessly with load testing, security audits, and performance tuning.',
    deliverables: [
      'Production Deployment',
      'Performance Benchmarks',
      'Security Audit Report',
      'Launch Day Support',
    ],
    icon: <Rocket />,
    color: '#4ECDC4',
  },
  {
    id: 5,
    phase: 'Scale',
    title: 'Growth & Enhancement',
    duration: 'Ongoing',
    description: 'Continuous improvement powered by data. We monitor performance, implement user feedback, and add AI-driven features to keep you ahead of the competition.',
    deliverables: [
      'Monthly Performance Reports',
      'Feature Enhancement Pipeline',
      'AI Model Optimization',
      '24/7 Monitoring & Support',
    ],
    icon: <TrendingUp />,
    color: '#9B59B6',
  },
];

export const Process: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const lineProgress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const handlePrevious = () => {
    setActiveStep((prev) => (prev > 0 ? prev - 1 : processSteps.length - 1));
  };

  const handleNext = () => {
    setActiveStep((prev) => (prev < processSteps.length - 1 ? prev + 1 : 0));
  };

  return (
    <Box
      id="process"
      ref={containerRef}
      sx={{
        py: 12,
        background: 'linear-gradient(180deg, #0a0a0a 0%, #000000 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '-5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(0, 191, 255, 0.08) 0%, transparent 60%)',
          filter: 'blur(80px)',
          animation: 'float 12s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          left: '-10%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(255, 215, 0, 0.08) 0%, transparent 60%)',
          filter: 'blur(70px)',
          animation: 'float 15s ease-in-out infinite reverse',
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
              Our Process
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
              From Vision to Victory
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
              A proven methodology that transforms ambitious ideas into 
              market-leading products
            </Typography>
          </Box>
        </motion.div>

        {/* Timeline visualization */}
        <Box sx={{ position: 'relative', mb: 8 }}>
          {/* Progress line */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '2px',
              background: alpha('#FFD700', 0.1),
              transform: 'translateY(-50%)',
              display: { xs: 'none', md: 'block' },
            }}
          >
            <motion.div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: lineProgress,
                background: 'linear-gradient(90deg, #FFD700 0%, #00BFFF 100%)',
              }}
            />
          </Box>

          {/* Timeline steps */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'space-between',
              position: 'relative',
              zIndex: 2,
            }}
          >
            {processSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Box
                  sx={{
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                    },
                  }}
                  onClick={() => setActiveStep(index)}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: activeStep === index
                        ? `linear-gradient(135deg, ${step.color} 0%, ${alpha(step.color, 0.7)} 100%)`
                        : alpha('#1a1a1a', 0.5),
                      backdropFilter: 'blur(10px)',
                      border: '2px solid',
                      borderColor: activeStep === index ? step.color : alpha(step.color, 0.3),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      mx: 'auto',
                      position: 'relative',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {React.cloneElement(step.icon as React.ReactElement, {
                      sx: {
                        fontSize: 32,
                        color: activeStep === index ? '#000' : step.color,
                      },
                    })}
                    {activeStep === index && (
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: -8,
                          borderRadius: '50%',
                          border: '2px solid',
                          borderColor: step.color,
                          opacity: 0.5,
                          animation: 'pulse 2s infinite',
                          '@keyframes pulse': {
                            '0%': { transform: 'scale(1)', opacity: 0.5 },
                            '50%': { transform: 'scale(1.1)', opacity: 0.3 },
                            '100%': { transform: 'scale(1)', opacity: 0.5 },
                          },
                        }}
                      />
                    )}
                  </Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: activeStep === index ? '#FFD700' : '#999',
                      fontWeight: activeStep === index ? 600 : 400,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {step.phase}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Box>

        {/* Step details card */}
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            sx={{
              background: alpha('#1a1a1a', 0.5),
              backdropFilter: 'blur(20px)',
              border: '1px solid',
              borderColor: alpha(processSteps[activeStep].color, 0.3),
              borderRadius: 3,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Gradient accent */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${processSteps[activeStep].color} 0%, ${alpha(processSteps[activeStep].color, 0.5)} 100%)`,
              }}
            />

            <CardContent sx={{ p: { xs: 3, sm: 4, md: 6 } }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 4,
                }}
              >
                <Box>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Box
                      sx={{
                        background: `linear-gradient(135deg, ${processSteps[activeStep].color} 0%, ${alpha(processSteps[activeStep].color, 0.7)} 100%)`,
                        borderRadius: '12px',
                        p: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {React.cloneElement(processSteps[activeStep].icon as React.ReactElement, {
                        sx: { color: '#000', fontSize: 32 },
                      })}
                    </Box>
                    <Box>
                      <Typography
                        variant="overline"
                        sx={{
                          color: processSteps[activeStep].color,
                          letterSpacing: '0.2em',
                        }}
                      >
                        Phase {processSteps[activeStep].id}
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{
                          color: '#F8F8FF',
                          fontWeight: 500,
                          fontSize: { xs: '1.5rem', sm: '2rem' },
                        }}
                      >
                        {processSteps[activeStep].title}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: processSteps[activeStep].color,
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                    }}
                  >
                    Duration: {processSteps[activeStep].duration}
                  </Typography>
                </Box>

                {/* Navigation arrows (mobile) */}
                <Box display={{ xs: 'flex', md: 'none' }} gap={1}>
                  <IconButton
                    onClick={handlePrevious}
                    sx={{
                      color: '#FFD700',
                      background: alpha('#FFD700', 0.1),
                      '&:hover': {
                        background: alpha('#FFD700', 0.2),
                      },
                    }}
                  >
                    <ChevronLeft />
                  </IconButton>
                  <IconButton
                    onClick={handleNext}
                    sx={{
                      color: '#FFD700',
                      background: alpha('#FFD700', 0.1),
                      '&:hover': {
                        background: alpha('#FFD700', 0.2),
                      },
                    }}
                  >
                    <ChevronRight />
                  </IconButton>
                </Box>
              </Box>

              <Typography
                variant="body1"
                sx={{
                  color: '#C0C0C0',
                  mb: 4,
                  fontSize: { xs: '1rem', sm: '1.125rem' },
                  lineHeight: 1.8,
                }}
              >
                {processSteps[activeStep].description}
              </Typography>

              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#FFD700',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Shield sx={{ fontSize: 20 }} />
                  Key Deliverables
                </Typography>
                <Box
                  component="ul"
                  sx={{
                    pl: 3,
                    m: 0,
                    '& li': {
                      color: '#999',
                      mb: 1,
                      position: 'relative',
                      listStyle: 'none',
                      '&::before': {
                        content: '"→"',
                        position: 'absolute',
                        left: -20,
                        color: processSteps[activeStep].color,
                      },
                    },
                  }}
                >
                  {processSteps[activeStep].deliverables.map((deliverable, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      {deliverable}
                    </motion.li>
                  ))}
                </Box>
              </Box>

              {/* Step indicators (mobile) */}
              <Box
                display={{ xs: 'flex', md: 'none' }}
                justifyContent="center"
                gap={1}
                mt={4}
              >
                {processSteps.map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: activeStep === index ? '#FFD700' : alpha('#FFD700', 0.3),
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onClick={() => setActiveStep(index)}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Success metrics */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Box
            sx={{
              mt: 8,
              p: { xs: 3, sm: 4 },
              background: alpha('#1a1a1a', 0.3),
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              border: '1px solid',
              borderColor: alpha('#FFD700', 0.2),
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: '#F8F8FF',
                mb: 4,
                fontWeight: 300,
              }}
            >
              Our Track Record
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                gap: { xs: 3, sm: 4 },
              }}
            >
              {[
                { value: '100%', label: 'On-Time Delivery' },
                { value: '3.2x', label: 'Average ROI' },
                { value: '<2hrs', label: 'Response Time' },
                { value: '98%', label: 'Client Retention' },
              ].map((metric, idx) => (
                <Box key={idx}>
                  <Typography
                    variant="h4"
                    sx={{
                      color: '#FFD700',
                      fontFamily: 'monospace',
                      fontWeight: 600,
                      mb: 1,
                      fontSize: { xs: '1.75rem', sm: '2.5rem' },
                    }}
                  >
                    {metric.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#808080',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    }}
                  >
                    {metric.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};