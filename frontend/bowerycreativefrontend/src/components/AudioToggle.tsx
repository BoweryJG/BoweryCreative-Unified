import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import audioManager from '../utils/audioManager';

export const AudioToggle: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Get initial state from audio manager
    setIsEnabled(audioManager.isEnabled());
    
    // Show toggle after a short delay
    const timer = setTimeout(() => setIsVisible(true), 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const toggleAudio = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    audioManager.setEnabled(newState);
    
    // Play a click sound if enabling
    if (newState) {
      audioManager.playClickSound();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <motion.button
            onClick={toggleAudio}
            className="relative group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-12 h-12 bg-carbon/90 backdrop-blur-md border border-racing-silver/30 rounded-full flex items-center justify-center hover:border-champagne transition-all duration-300">
              <AnimatePresence mode="wait">
                {isEnabled ? (
                  <motion.div
                    key="volume-on"
                    initial={{ opacity: 0, rotate: -180 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Volume2 className="w-5 h-5 text-champagne" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="volume-off"
                    initial={{ opacity: 0, rotate: -180 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <VolumeX className="w-5 h-5 text-racing-silver" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Pulse animation when enabled */}
            {isEnabled && (
              <motion.div
                className="absolute inset-0 -z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-full h-full bg-champagne rounded-full blur-xl" />
              </motion.div>
            )}
            
            {/* Tooltip */}
            <motion.div
              className="absolute bottom-full right-0 mb-2 pointer-events-none"
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-obsidian/90 backdrop-blur-md text-arctic text-xs px-3 py-2 rounded whitespace-nowrap border border-racing-silver/20">
                {isEnabled ? 'Sound On' : 'Sound Off'}
              </div>
            </motion.div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};