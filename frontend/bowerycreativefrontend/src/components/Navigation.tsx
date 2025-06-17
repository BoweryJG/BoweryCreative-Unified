import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Cpu, Brain, Code2, Database, LayoutDashboard, CreditCard, Rocket } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { CosmicOnboarding } from './CosmicOnboarding';

const navItems = [
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Showcase', href: '#showcase' },
  { label: 'Technology', href: '#technology' },
  { label: 'Process', href: '#process' },
  { label: 'About', href: '#about' },
  { label: 'Insights', href: '#insights' },
  { label: 'Contact', href: '#contact' },
];

export const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isScrolled ? 'bg-obsidian/90 backdrop-blur-lg border-b border-graphite' : ''
        }`}
      >
        <div className="container-luxury">
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <div className="w-10 h-10 border border-champagne rotate-45 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-champagne -rotate-45" />
                </div>
              </div>
              <a href="/" className="font-sans text-xl font-medium tracking-wide text-arctic">
                BOWERY
              </a>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-10">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="text-xs tracking-[0.2em] uppercase text-racing-silver hover:text-champagne transition-all duration-300 relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-2 left-0 w-0 h-px bg-champagne transition-all duration-300 group-hover:w-full" />
                </motion.a>
              ))}
            </nav>

            {/* Desktop CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="hidden lg:flex items-center gap-4"
            >
              {user && (
                <>
                  {isAdmin && (
                    <a
                      href="https://bowerycreative-dashboard.netlify.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </a>
                  )}
                  <a
                    href="https://bowerycreativepayments.netlify.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost flex items-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    Billing
                  </a>
                </>
              )}
              <motion.button 
                onClick={() => setIsOnboardingOpen(true)}
                className="btn-primary cosmic-glow flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Rocket className="w-4 h-4" />
                Start Project
              </motion.button>
            </motion.div>

            {/* Mobile Menu Toggle */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 -mr-2 text-champagne"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-obsidian lg:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full px-8">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-3xl font-display text-arctic mb-8 hover:text-champagne transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-2 left-0 w-0 h-px bg-champagne transition-all duration-300 group-hover:w-full" />
                </motion.a>
              ))}
              
              {user && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col gap-4 mt-4"
                >
                  {isAdmin && (
                    <a
                      href="https://bowerycreative-dashboard.netlify.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xl text-champagne flex items-center gap-2 justify-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      Dashboard
                    </a>
                  )}
                  <a
                    href="https://bowerycreativepayments.netlify.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl text-champagne flex items-center gap-2 justify-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <CreditCard className="w-5 h-5" />
                    Billing
                  </a>
                </motion.div>
              )}
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 flex gap-6"
              >
                <Code2 className="w-6 h-6 text-racing-silver" />
                <Database className="w-6 h-6 text-racing-silver" />
                <Cpu className="w-6 h-6 text-racing-silver" />
                <Brain className="w-6 h-6 text-racing-silver" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar */}
      {isScrolled && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="fixed top-[80px] md:top-[96px] left-0 right-0 h-[1px] bg-champagne z-50 origin-left"
          style={{ transformOrigin: '0 0' }}
        />
      )}

      {/* Cosmic Onboarding Modal */}
      <AnimatePresence>
        {isOnboardingOpen && (
          <CosmicOnboarding onClose={() => setIsOnboardingOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
};