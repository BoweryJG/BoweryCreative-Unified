import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2 } from 'lucide-react';

export const DashboardAccess: React.FC = () => {
  const [isVisible] = useState(true);

  const handleDashboardAccess = () => {
    // Open dashboard in new tab
    window.open('https://bowerycreative-dashboard.netlify.app/', '_blank');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-8 left-8 z-50"
        >
          <motion.button
            onClick={handleDashboardAccess}
            className="relative group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => {
              // Trigger hover sound if audio is enabled
              const audioElement = document.createElement('audio');
              audioElement.src = '/audio/hover.mp3';
              audioElement.volume = 0.3;
              audioElement.play().catch(() => {});
            }}
          >
            <div className="w-12 h-12 bg-carbon/90 backdrop-blur-md border border-racing-silver/30 rounded-full flex items-center justify-center hover:border-champagne transition-all duration-300">
              <Code2 className="w-5 h-5 text-champagne" />
            </div>
            
            {/* Pulse animation */}
            <motion.div
              className="absolute inset-0 -z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-full h-full bg-champagne rounded-full blur-xl" />
            </motion.div>
            
            {/* Tooltip */}
            <motion.div
              className="absolute bottom-full left-0 mb-2 pointer-events-none"
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-obsidian/90 backdrop-blur-md text-arctic text-xs px-3 py-2 rounded whitespace-nowrap border border-racing-silver/20">
                Mission Control
              </div>
            </motion.div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};