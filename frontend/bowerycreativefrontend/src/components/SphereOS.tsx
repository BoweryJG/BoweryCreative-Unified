import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedSection } from './ui/AnimatedSection';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { 
  Brain, 
  Users, 
  BarChart, 
  Zap,
  CheckCircle,
  ArrowRight,
  Play
} from 'lucide-react';

const sphereModules = [
  {
    id: 'repspheres',
    title: 'RepSpheres',
    subtitle: 'Sales Automation AI',
    description: 'Empower your sales team with intelligent automation that learns from every interaction.',
    features: [
      'AI-powered lead qualification',
      'Automated follow-up sequences',
      'Performance analytics dashboard',
      'CRM integration capabilities'
    ],
    stats: {
      metric: '37%',
      label: 'Avg. Conversion Increase'
    },
    icon: Users,
    color: 'from-blue-500/20',
  },
  {
    id: 'docspheres',
    title: 'DocSpheres',
    subtitle: 'Practice Workflow Automation',
    description: 'Streamline practice management and patient communication with AI-driven workflows.',
    features: [
      'Patient journey automation',
      'Intelligent scheduling system',
      'Treatment plan management',
      'HIPAA-compliant communications'
    ],
    stats: {
      metric: '62%',
      label: 'Admin Time Saved'
    },
    icon: Brain,
    color: 'from-emerald-500/20',
  },
  {
    id: 'sphereos',
    title: 'Sphere OS',
    subtitle: 'Marketing Intelligence Platform',
    description: 'Leverage predictive analytics and market intelligence to optimize your strategy.',
    features: [
      'Market trend prediction',
      'Competitive analysis',
      'Campaign optimization',
      'ROI forecasting'
    ],
    stats: {
      metric: '300+',
      label: 'AI Models Available'
    },
    icon: BarChart,
    color: 'from-purple-500/20',
  },
];

export const SphereOS: React.FC = () => {
  const [activeModule, setActiveModule] = useState(sphereModules[0]);

  return (
    <AnimatedSection className="section-padding bg-gradient-soft">
      <div className="container-elegant">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-elegant-accent text-sm font-medium tracking-[0.3em] uppercase mb-4"
          >
            Technology Platform
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-light text-elegant-dark mb-6"
          >
            Sphere OS
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-elegant-dark/60 max-w-3xl mx-auto"
          >
            The industry's most advanced AI platform for medical aesthetics
          </motion.p>
        </div>

        {/* Module Selector */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {sphereModules.map((module) => (
            <motion.button
              key={module.id}
              onClick={() => setActiveModule(module)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeModule.id === module.id
                  ? 'bg-elegant-accent text-elegant-white'
                  : 'bg-elegant-dark/10 text-elegant-dark hover:bg-elegant-dark/20'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {module.title}
            </motion.button>
          ))}
        </motion.div>

        {/* Module Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModule.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            {/* Left: Module Info */}
            <div>
              <Card gradient="dark" className="relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${activeModule.color} to-transparent opacity-50`} />
                
                <div className="relative z-10">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-20 h-20 rounded-2xl bg-elegant-accent/10 flex items-center justify-center mb-8"
                  >
                    <activeModule.icon className="w-10 h-10 text-elegant-accent" />
                  </motion.div>

                  <h3 className="text-3xl font-display font-medium text-elegant-dark mb-2">
                    {activeModule.title}
                  </h3>
                  <p className="text-elegant-accent text-lg mb-4">
                    {activeModule.subtitle}
                  </p>
                  <p className="text-elegant-dark/70 mb-8">
                    {activeModule.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {activeModule.features.map((feature, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                        className="flex items-center"
                      >
                        <CheckCircle className="w-5 h-5 text-elegant-accent mr-3 flex-shrink-0" />
                        <span className="text-elegant-dark/80">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-8 border-t border-elegant-dark/10">
                    <div>
                      <div className="text-3xl font-display font-bold text-elegant-accent">
                        {activeModule.stats.metric}
                      </div>
                      <div className="text-sm text-elegant-dark/60">
                        {activeModule.stats.label}
                      </div>
                    </div>
                    <Button variant="primary" size="sm">
                      Request Demo
                      <ArrowRight className="w-4 h-4 ml-2 inline" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right: Interactive Demo */}
            <div className="relative">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="relative aspect-video rounded-2xl overflow-hidden bg-elegant-cream/50 backdrop-blur-sm border border-elegant-accent/20"
              >
                {/* Demo Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-20 h-20 rounded-full bg-elegant-accent/20 flex items-center justify-center cursor-pointer group"
                  >
                    <Play className="w-8 h-8 text-elegant-accent ml-1 group-hover:text-elegant-dark transition-colors" />
                  </motion.div>
                </div>

                {/* Animated Grid Background */}
                <div className="absolute inset-0 opacity-20">
                  <svg className="w-full h-full">
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-elegant-accent" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute top-10 right-10 w-32 h-32 rounded-2xl bg-gradient-to-br from-elegant-accent/20 to-transparent backdrop-blur-sm"
                />
                <motion.div
                  animate={{
                    y: [0, 20, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute bottom-10 left-10 w-40 h-40 rounded-2xl bg-gradient-to-br from-blue-500/20 to-transparent backdrop-blur-sm"
                />
              </motion.div>

              {/* Live Demo Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -top-4 -right-4 bg-elegant-accent text-elegant-white px-4 py-2 rounded-full text-sm font-medium flex items-center"
              >
                <Zap className="w-4 h-4 mr-1" />
                Live Demo
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-elegant-dark/60 mb-6">
            Experience the power of AI-driven automation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg">
              Schedule Full Platform Demo
            </Button>
            <Button variant="secondary" size="lg">
              Download Tech Specs
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
};