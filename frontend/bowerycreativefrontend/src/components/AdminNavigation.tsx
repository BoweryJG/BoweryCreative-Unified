import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, LayoutDashboard, CreditCard, Users, FileText, Settings, LogOut, ChevronDown, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const AdminNavigation: React.FC = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-obsidian border-b border-graphite"
    >
      <div className="container-luxury">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 border border-champagne rotate-45 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-champagne -rotate-45" />
                </div>
              </div>
              <span className="font-sans text-xl font-medium tracking-wide text-arctic">
                BOWERY
              </span>
            </a>

            {/* Admin Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              <a
                href="/admin"
                className="flex items-center gap-2 text-arctic hover:text-champagne transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </a>
              <a
                href="/clients"
                className="flex items-center gap-2 text-arctic hover:text-champagne transition-colors"
              >
                <Users className="w-4 h-4" />
                Clients
              </a>
              <a
                href="/billing"
                className="flex items-center gap-2 text-arctic hover:text-champagne transition-colors"
              >
                <CreditCard className="w-4 h-4" />
                Billing
              </a>
              <a
                href="/invoices"
                className="flex items-center gap-2 text-arctic hover:text-champagne transition-colors"
              >
                <FileText className="w-4 h-4" />
                Invoices
              </a>
            </nav>
          </div>

          {/* User Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-graphite hover:bg-graphite/80 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-champagne flex items-center justify-center">
                <User className="w-4 h-4 text-obsidian" />
              </div>
              <span className="text-arctic text-sm font-medium hidden sm:block">
                {user?.email?.split('@')[0] || 'Admin'}
              </span>
              <ChevronDown className={`w-4 h-4 text-arctic transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-graphite border border-graphite rounded-lg shadow-xl overflow-hidden"
                >
                  <a
                    href="/settings"
                    className="flex items-center gap-2 px-4 py-3 hover:bg-graphite/50 transition-colors text-arctic"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </a>
                  <div className="border-t border-obsidian" />
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-4 py-3 hover:bg-graphite/50 transition-colors text-arctic"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};