import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Chrome, Sparkles, Star, Loader2 } from 'lucide-react';
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
          {/* Cosmic Backdrop with animated stars */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-purple-900/90 via-black to-blue-900/90 backdrop-blur-md z-50"
            onClick={onClose}
          >
            {/* Animated Stars */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-white rounded-full"
                style={{
                  width: Math.random() * 3 + 1 + 'px',
                  height: Math.random() * 3 + 1 + 'px',
                  left: Math.random() * 100 + '%',
                  top: Math.random() * 100 + '%',
                }}
                animate={{
                  opacity: [0.2, 1, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </motion.div>
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateY: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-gradient-to-br from-purple-900/30 via-gray-900/50 to-blue-900/30 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 w-full max-w-md relative overflow-hidden shadow-2xl">
              {/* Animated cosmic background orb */}
              <motion.div
                className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              
              {/* Close Button */}
              <motion.button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>

              {/* Spinning Galaxy Icon */}
              <motion.div
                className="w-20 h-20 mx-auto mb-6 relative"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-lg opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                {/* Orbiting stars */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                    style={{
                      top: '50%',
                      left: '50%',
                    }}
                    animate={{
                      x: [0, 30 * Math.cos(i * 120 * Math.PI / 180), 0],
                      y: [0, 30 * Math.sin(i * 120 * Math.PI / 180), 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  />
                ))}
              </motion.div>

              {/* Header */}
              <motion.div 
                className="text-center mb-6 relative z-10"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  {isUnauthorized ? 'Access Restricted' : 'Welcome to the Cosmos'}
                </h2>
                <p className="text-gray-300 text-sm">
                  {isUnauthorized 
                    ? 'Your account does not have access to this platform'
                    : 'Sign in to access your cosmic dashboard'
                  }
                </p>
              </motion.div>

              {/* Unauthorized Message */}
              {isUnauthorized && (
                <motion.div 
                  className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 backdrop-blur-sm"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-red-400 text-sm font-semibold">
                    <strong>Unauthorized Access</strong>
                  </p>
                  <p className="text-red-300/80 text-sm mt-1">
                    Your account ({user?.email}) does not have access to the BoweryCreative platform. 
                    This area is restricted to authorized administrators and clients only.
                  </p>
                  <p className="text-red-300/80 text-sm mt-2">
                    If you believe you should have access, please contact your administrator.
                  </p>
                </motion.div>
              )}

              {/* Login Form */}
              {!isUnauthorized && (
                <motion.form 
                  onSubmit={handleEmailSignIn} 
                  className="space-y-4 relative z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div 
                        className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 backdrop-blur-sm"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                      >
                        <p className="text-red-400 text-sm">{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Google Sign In */}
                  <motion.button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full bg-white/10 backdrop-blur-sm text-white font-medium py-3 px-4 rounded-xl border border-white/20 hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Chrome className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                    Sign in with Google
                  </motion.button>

                  <div className="flex items-center gap-4">
                    <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent flex-1" />
                    <span className="text-gray-400 text-sm">OR</span>
                    <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent flex-1" />
                  </div>

                  {/* Email Input */}
                  <motion.div 
                    className="relative"
                    whileHover={{ scale: 1.02 }}
                  >
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="w-full bg-white/5 backdrop-blur-sm border border-purple-500/30 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all disabled:opacity-50"
                      required
                    />
                  </motion.div>

                  {/* Password Input */}
                  <motion.div 
                    className="relative"
                    whileHover={{ scale: 1.02 }}
                  >
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="w-full bg-white/5 backdrop-blur-sm border border-purple-500/30 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all disabled:opacity-50"
                      required
                    />
                  </motion.div>

                  {/* Sign In Button */}
                  <motion.button
                    type="submit"
                    disabled={loading || !email || !password}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Entering the cosmos...
                        </>
                      ) : (
                        <>
                          <Star className="w-5 h-5" />
                          Sign In
                        </>
                      )}
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                </motion.form>
              )}

              {/* Footer */}
              <motion.div 
                className="mt-6 pt-4 border-t border-purple-500/20 relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {isUnauthorized ? (
                  <motion.button
                    onClick={onClose}
                    className="w-full bg-gray-800/50 backdrop-blur-sm text-gray-300 font-medium py-2 px-4 rounded-xl hover:bg-gray-700/50 transition-all border border-gray-700/50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Return to Website
                  </motion.button>
                ) : (
                  <p className="text-gray-400 text-sm text-center">
                    Don't have an account?{' '}
                    <button
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
                    >
                      Contact us for access
                    </button>
                  </p>
                )}
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};