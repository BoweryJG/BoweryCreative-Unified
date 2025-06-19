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
          {/* Enhanced Cosmic Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-purple-900/95 via-indigo-900/90 via-black to-blue-900/95 backdrop-blur-xl z-50"
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
            <div className="bg-gradient-to-br from-purple-900/40 via-indigo-900/30 via-gray-900/60 to-blue-900/40 backdrop-blur-2xl border-2 border-transparent rounded-[32px] p-8 w-full max-w-md relative overflow-hidden shadow-2xl before:absolute before:inset-0 before:rounded-[32px] before:p-[2px] before:bg-gradient-to-br before:from-yellow-400/60 before:via-purple-500/40 before:to-blue-400/60 before:-z-10 before:blur-sm after:absolute after:inset-0 after:rounded-[32px] after:bg-gradient-to-t after:from-purple-600/10 after:to-transparent after:-z-10">
              {/* Multiple animated cosmic orbs */}
              <motion.div
                className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-purple-600/30 via-pink-500/20 to-blue-600/30 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <motion.div
                className="absolute -bottom-20 -left-20 w-48 h-48 bg-gradient-to-br from-yellow-400/20 via-orange-500/20 to-pink-500/20 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [360, 180, 0],
                }}
                transition={{
                  duration: 8,
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

              {/* Enhanced Spinning Galaxy Icon */}
              <motion.div
                className="w-24 h-24 mx-auto mb-6 relative"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-purple-500 to-blue-500 rounded-full blur-xl opacity-60 animate-pulse" />
                <div className="absolute inset-2 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl">
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-12 h-12 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]" />
                  </motion.div>
                </div>
                {/* Enhanced orbiting stars */}
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 rounded-full shadow-lg"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, ${['#fbbf24', '#f59e0b', '#10b981', '#3b82f6'][i]}, ${['#f59e0b', '#ef4444', '#059669', '#2563eb'][i]})`,
                      top: '50%',
                      left: '50%',
                      boxShadow: `0 0 10px ${['#fbbf24', '#f59e0b', '#10b981', '#3b82f6'][i]}`,
                    }}
                    animate={{
                      x: [0, 35 * Math.cos(i * 90 * Math.PI / 180), 0],
                      y: [0, 35 * Math.sin(i * 90 * Math.PI / 180), 0],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut",
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
                <h2 className="text-4xl font-black bg-gradient-to-r from-yellow-400 via-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-2 animate-gradient-x bg-[length:200%_auto]">
                  {isUnauthorized ? 'Access Restricted' : 'Welcome to Bowery'}
                </h2>
                <p className="text-gray-200 text-base font-medium tracking-wide">
                  {isUnauthorized 
                    ? 'Your account does not have access to this platform'
                    : 'Enter the cosmic dashboard'
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

                  {/* Enhanced Google Sign In */}
                  <motion.button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-4 px-4 rounded-2xl shadow-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group relative overflow-hidden"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Chrome className="w-6 h-6 group-hover:rotate-180 transition-transform duration-700 relative z-10" />
                    <span className="relative z-10 text-lg">Sign in with Google</span>
                  </motion.button>

                  <div className="flex items-center gap-4 my-6">
                    <div className="h-0.5 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent flex-1" />
                    <span className="text-yellow-400 text-sm font-semibold px-3 py-1 bg-yellow-400/10 rounded-full border border-yellow-400/30">OR</span>
                    <div className="h-0.5 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent flex-1" />
                  </div>

                  {/* Enhanced Email Input */}
                  <motion.div 
                    className="relative group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400 w-5 h-5 z-10" />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="relative w-full bg-white/5 backdrop-blur-sm border-2 border-purple-500/30 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-300 focus:outline-none focus:border-yellow-400/50 focus:bg-white/10 transition-all disabled:opacity-50 font-medium"
                      required
                    />
                  </motion.div>

                  {/* Enhanced Password Input */}
                  <motion.div 
                    className="relative group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400 w-5 h-5 z-10" />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="relative w-full bg-white/5 backdrop-blur-sm border-2 border-purple-500/30 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-300 focus:outline-none focus:border-yellow-400/50 focus:bg-white/10 transition-all disabled:opacity-50 font-medium"
                      required
                    />
                  </motion.div>

                  {/* Enhanced Sign In Button */}
                  <motion.button
                    type="submit"
                    disabled={loading || !email || !password}
                    className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold py-4 px-4 rounded-2xl shadow-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group mt-6"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10 flex items-center justify-center gap-3 text-lg">
                      {loading ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin" />
                          Entering the cosmos...
                        </>
                      ) : (
                        <>
                          <Star className="w-6 h-6 animate-pulse" />
                          Enter Dashboard
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 bg-white/20 rounded-full blur-3xl opacity-0 group-hover:opacity-50 group-hover:scale-150 transition-all duration-500" />
                    </div>
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