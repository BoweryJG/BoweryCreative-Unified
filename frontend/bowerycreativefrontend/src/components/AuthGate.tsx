import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { LoginModal } from './LoginModal';

interface AuthGateProps {
  children: React.ReactNode;
}

export const AuthGate: React.FC<AuthGateProps> = ({ children }) => {
  const { user, loading, hasAccess } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAuthGate, setShowAuthGate] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user || !hasAccess) {
        setShowAuthGate(true);
      } else {
        setShowAuthGate(false);
      }
    }
  }, [user, loading, hasAccess]);

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-champagne mx-auto mb-4"></div>
          <p className="text-arctic/70">Loading...</p>
        </div>
      </div>
    );
  }

  if (showAuthGate) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-obsidian via-carbon to-obsidian flex items-center justify-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(212, 175, 55, 0.1) 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-obsidian/80 backdrop-blur-lg border border-racing-silver/20 rounded-2xl p-8 max-w-md w-full mx-4 text-center relative z-10"
          >
            {/* Icon */}
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-champagne/20 to-champagne/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-champagne" />
              </div>
            </div>

            {/* Content */}
            <h1 className="text-3xl font-bold text-champagne mb-4">
              Access Restricted
            </h1>
            
            <p className="text-arctic/70 mb-2">
              This platform is restricted to authorized users only.
            </p>
            
            <p className="text-arctic/50 text-sm mb-8">
              Please sign in with your authorized account to continue.
            </p>

            {/* Sign In Button */}
            <button
              onClick={() => setShowLoginModal(true)}
              className="w-full bg-gradient-to-r from-champagne to-champagne/80 text-obsidian font-medium py-3 px-6 rounded-lg hover:from-champagne/90 hover:to-champagne/70 transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-5 h-5" />
              Sign In
            </button>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-racing-silver/20">
              <p className="text-arctic/50 text-sm">
                Need access?{' '}
                <a
                  href="mailto:jason@bowerycreativeagency.com"
                  className="text-champagne hover:text-champagne/80 transition-colors"
                >
                  Contact us
                </a>
              </p>
            </div>
          </motion.div>
        </div>

        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)} 
        />
      </>
    );
  }

  return <>{children}</>;
};