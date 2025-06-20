import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Cpu, Brain, Code2, Database, LayoutDashboard, CreditCard, Rocket, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { CosmicOnboarding } from './CosmicOnboarding';
import { CosmicOnboardingAutonomous } from './CosmicOnboardingAutonomous';
import audioManager from '../utils/audioManager';

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
  const [isAutonomousOnboardingOpen, setIsAutonomousOnboardingOpen] = useState(false);
  const [showStartDropdown, setShowStartDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowStartDropdown(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowStartDropdown(false);
      }
    };

    if (showStartDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showStartDropdown]);

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
              <a 
                href="/admin-login" 
                className="relative block"
                onClick={() => audioManager.playClickSound()}
                onMouseEnter={() => audioManager.playHoverSound(523.25)} // C5 note for admin icon
              >
                <div className="w-10 h-10 border border-champagne rotate-45 flex items-center justify-center hover:bg-champagne/10 transition-colors cursor-pointer">
                  <Brain className="w-5 h-5 text-champagne -rotate-45" />
                </div>
              </a>
              <a 
                href="/" 
                className="font-sans text-xl font-medium tracking-wide text-arctic cursor-pointer hover:text-champagne transition-colors"
                onClick={(e) => {
                  if (e.detail === 3) { // Triple click
                    e.preventDefault();
                    window.location.href = '/admin';
                  }
                }}
              >
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
                    href="/billing"
                    className="btn-ghost flex items-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    Billing
                  </a>
                </>
              )}
              <div className="relative" ref={dropdownRef}>
                <motion.button 
                  onClick={() => setShowStartDropdown(!showStartDropdown)}
                  className="btn-primary cosmic-glow flex items-center gap-2 text-sm md:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Rocket className="w-4 h-4" />
                  <span className="hidden sm:inline">Start Project</span>
                  <span className="sm:hidden">Start</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showStartDropdown ? 'rotate-180' : ''}`} />
                </motion.button>
                
                <AnimatePresence>
                  {showStartDropdown && (
                    <>
                      {/* Mobile overlay */}
                      <div 
                        className="fixed inset-0 z-40 bg-black/20 lg:hidden"
                        onClick={() => setShowStartDropdown(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-40 sm:w-48 bg-[#1a1a2e]/95 backdrop-blur border border-white/20 rounded-lg shadow-xl overflow-hidden z-[60]"
                      >
                      <button
                        onClick={() => {
                          setIsOnboardingOpen(true);
                          setShowStartDropdown(false);
                        }}
                        className="w-full px-3 py-2 flex items-center gap-2 hover:bg-white/10 transition-colors text-left"
                      >
                        <CreditCard className="w-4 h-4 text-yellow-400" />
                        <div>
                          <p className="text-sm font-semibold">Access Code</p>
                          <p className="text-xs text-gray-400">Existing clients</p>
                        </div>
                      </button>
                      
                      <div className="border-t border-white/10"></div>
                      
                      <button
                        onClick={() => {
                          setIsAutonomousOnboardingOpen(true);
                          setShowStartDropdown(false);
                        }}
                        className="w-full px-3 py-2 flex items-center gap-2 hover:bg-white/10 transition-colors text-left"
                      >
                        <Rocket className="w-4 h-4 text-orange-400" />
                        <div>
                          <p className="text-sm font-semibold">Browse Packages</p>
                          <p className="text-xs text-gray-400">New customers</p>
                        </div>
                      </button>
                    </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
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
                className="mt-8"
              >
                <p className="text-center text-sm text-racing-silver mb-4">Start Your Project</p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      setIsOnboardingOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="btn-primary cosmic-glow flex items-center gap-2 justify-center"
                  >
                    <CreditCard className="w-4 h-4" />
                    I Have an Access Code
                  </button>
                  <button
                    onClick={() => {
                      setIsAutonomousOnboardingOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="btn-ghost flex items-center gap-2 justify-center"
                  >
                    <Rocket className="w-4 h-4" />
                    Browse Packages
                  </button>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
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

      {/* Autonomous Onboarding Modal */}
      <AnimatePresence>
        {isAutonomousOnboardingOpen && (
          <CosmicOnboardingAutonomous onClose={() => setIsAutonomousOnboardingOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
};