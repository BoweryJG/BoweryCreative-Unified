import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Chrome } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { signIn, signInWithGoogle, user, hasAccess } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Check if user is logged in but unauthorized
  const isUnauthorized = user && !hasAccess;

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      console.log('Frontend LoginModal: Starting sign in process');
      await signIn(email, password);
      console.log('Frontend LoginModal: Sign in completed, user:', user, 'hasAccess:', hasAccess);
      if (hasAccess) {
        onClose();
      }
    } catch (err: any) {
      console.error('Frontend LoginModal: Sign in error:', err);
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-obsidian/95 backdrop-blur-md border border-racing-silver/20 rounded-2xl p-8 w-full max-w-md relative">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-arctic/60 hover:text-arctic transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-champagne mb-2">
                  {isUnauthorized ? 'Access Restricted' : 'Welcome to BoweryCreative'}
                </h2>
                <p className="text-arctic/70 text-sm">
                  {isUnauthorized 
                    ? 'Your account does not have access to this platform'
                    : 'Sign in to access your account'
                  }
                </p>
              </div>

              {/* Unauthorized Message */}
              {isUnauthorized && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
                  <p className="text-red-400 text-sm">
                    <strong>Unauthorized Access</strong>
                  </p>
                  <p className="text-red-300/80 text-sm mt-1">
                    Your account ({user?.email}) does not have access to the BoweryCreative platform. 
                    This area is restricted to authorized administrators and clients only.
                  </p>
                  <p className="text-red-300/80 text-sm mt-2">
                    If you believe you should have access, please contact your administrator.
                  </p>
                </div>
              )}

              {/* Login Form */}
              {!isUnauthorized && (
                <form onSubmit={handleEmailSignIn} className="space-y-4">
                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Google Sign In */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full bg-white text-obsidian font-medium py-3 px-4 rounded-lg border border-racing-silver/20 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Chrome className="w-5 h-5" />
                    Sign in with Google
                  </button>

                  <div className="flex items-center gap-4">
                    <div className="h-px bg-racing-silver/20 flex-1" />
                    <span className="text-arctic/50 text-sm">OR</span>
                    <div className="h-px bg-racing-silver/20 flex-1" />
                  </div>

                  {/* Email Input */}
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-arctic/50 w-5 h-5" />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="w-full bg-carbon/50 border border-racing-silver/20 rounded-lg py-3 pl-10 pr-4 text-arctic placeholder-arctic/50 focus:outline-none focus:border-champagne/50 disabled:opacity-50"
                      required
                    />
                  </div>

                  {/* Password Input */}
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-arctic/50 w-5 h-5" />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="w-full bg-carbon/50 border border-racing-silver/20 rounded-lg py-3 pl-10 pr-4 text-arctic placeholder-arctic/50 focus:outline-none focus:border-champagne/50 disabled:opacity-50"
                      required
                    />
                  </div>

                  {/* Sign In Button */}
                  <button
                    type="submit"
                    disabled={loading || !email || !password}
                    className="w-full bg-gradient-to-r from-champagne to-champagne/80 text-obsidian font-medium py-3 px-4 rounded-lg hover:from-champagne/90 hover:to-champagne/70 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>
              )}

              {/* Footer */}
              {isUnauthorized ? (
                <div className="mt-6 pt-4 border-t border-racing-silver/20">
                  <button
                    onClick={onClose}
                    className="w-full bg-racing-silver/10 text-arctic/80 font-medium py-2 px-4 rounded-lg hover:bg-racing-silver/20 transition-colors"
                  >
                    Return to Website
                  </button>
                </div>
              ) : (
                <div className="mt-6 pt-4 border-t border-racing-silver/20 text-center">
                  <p className="text-arctic/50 text-sm">
                    Don't have an account?{' '}
                    <button
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="text-champagne hover:text-champagne/80 transition-colors"
                    >
                      Contact us for access
                    </button>
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};