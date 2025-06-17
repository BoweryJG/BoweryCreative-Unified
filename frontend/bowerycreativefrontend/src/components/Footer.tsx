import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Github, Linkedin, Twitter, Code2, Database, Cpu } from 'lucide-react';
import { TechIcon } from './TechIcon';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-carbon border-t border-graphite relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian to-carbon" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-champagne to-transparent" />
      
      <div className="container-luxury py-16 md:py-24 relative z-10">
        <div className="grid lg:grid-cols-3 gap-16">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-1"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="w-12 h-12 border border-champagne rotate-45 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-champagne -rotate-45" />
                </div>
              </div>
              <h3 className="font-sans text-2xl font-medium tracking-wide text-arctic">
                BOWERY
              </h3>
            </div>
            
            <p className="text-titanium font-light leading-relaxed mb-8">
              Engineering tomorrow's intelligence through precision-crafted AI solutions, 
              full-stack development, and data synthesis at scale.
            </p>

            {/* Tech Icons */}
            <div className="flex gap-4 mb-8">
              <TechIcon 
                icon={<Code2 className="w-5 h-5 text-racing-silver hover:text-champagne transition-colors" />}
                type="code"
              />
              <TechIcon 
                icon={<Database className="w-5 h-5 text-racing-silver hover:text-champagne transition-colors" />}
                type="database"
              />
              <TechIcon 
                icon={<Cpu className="w-5 h-5 text-racing-silver hover:text-champagne transition-colors" />}
                type="cpu"
              />
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              <a 
                href="https://github.com/jasonwgolden" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-racing-silver hover:text-champagne transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://www.linkedin.com/in/jasonwilliamgolden/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-racing-silver hover:text-champagne transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com/jasonwgolden" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-racing-silver hover:text-champagne transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* Services Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <h4 className="text-champagne text-xs tracking-[0.2em] uppercase font-mono mb-6">
              Capabilities
            </h4>
            <nav className="space-y-3">
              {[
                'AI Infrastructure',
                'Machine Learning',
                'Full-Stack Development',
                'Data Analytics',
                'Process Automation',
                'Custom AI Agents',
                'Creative Technology'
              ].map((service) => (
                <a 
                  key={service}
                  href="#capabilities" 
                  className="block text-racing-silver hover:text-champagne transition-colors text-sm"
                >
                  {service}
                </a>
              ))}
            </nav>
          </motion.div>

          {/* Contact Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <h4 className="text-champagne text-xs tracking-[0.2em] uppercase font-mono mb-6">
              Connect
            </h4>
            
            <div className="space-y-4 mb-8">
              <div>
                <p className="text-xs uppercase tracking-wide text-racing-silver mb-1">Contact</p>
                <a 
                  href="#contact" 
                  className="text-arctic hover:text-champagne transition-colors"
                >
                  Secure Contact Form
                </a>
              </div>
              
              <div>
                <p className="text-xs uppercase tracking-wide text-racing-silver mb-1">Location</p>
                <p className="text-arctic">New York City</p>
              </div>
              
              <div>
                <p className="text-xs uppercase tracking-wide text-racing-silver mb-1">Availability</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-electric rounded-full animate-pulse" />
                  <p className="text-arctic">Available for projects</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="pt-12 mt-12 border-t border-graphite flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-sm text-racing-silver">
            © 2025 Bowery Creative. Engineering Intelligence.
          </p>
          
          <div className="flex gap-8 text-sm">
            <a href="#privacy-policy" className="text-racing-silver hover:text-champagne transition-colors">
              Privacy Policy
            </a>
            <a href="#terms-of-service" className="text-racing-silver hover:text-champagne transition-colors">
              Terms of Service
            </a>
          </div>
        </motion.div>
      </div>

      {/* Performance lines */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-champagne to-transparent race-line" />
    </footer>
  );
};