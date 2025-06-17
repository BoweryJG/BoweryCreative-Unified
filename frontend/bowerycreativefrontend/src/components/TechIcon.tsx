import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import audioManager from '../utils/audioManager';

interface TechIconProps {
  icon: React.ReactNode;
  type: 'code' | 'database' | 'cpu';
  className?: string;
}

export const TechIcon: React.FC<TechIconProps> = ({ icon, type, className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);

  const playSound = async () => {
    try {
      // Use centralized audioManager with different frequencies for each type
      switch (type) {
        case 'code':
          // Higher frequency for code - clean, precise
          await audioManager.playHoverSound(523.25); // C5
          break;
        
        case 'database':
          // Mid frequency for database - stable, reliable
          await audioManager.playHoverSound(440); // A4
          break;
        
        case 'cpu':
          // Lower frequency for CPU - powerful, deep
          await audioManager.playHoverSound(261.63); // C4
          break;
      }
    } catch (error) {
      console.log('Audio playback failed:', error);
    }
  };

  const renderAnimation = () => {
    switch (type) {
      case 'code':
        return (
          <AnimatePresence>
            {isHovered && (
              <>
                {/* Code snippets animation */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute pointer-events-none"
                    initial={{ opacity: 0, scale: 0, y: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0.8],
                      y: -40 - i * 15,
                      x: (i - 2) * 20
                    }}
                    transition={{ 
                      duration: 1.5,
                      delay: i * 0.1,
                      ease: "easeOut"
                    }}
                  >
                    <span className="text-champagne font-mono text-xs whitespace-nowrap">
                      {['const', 'function', 'async', 'return', 'export'][i]}
                    </span>
                  </motion.div>
                ))}
              </>
            )}
          </AnimatePresence>
        );

      case 'database':
        return (
          <AnimatePresence>
            {isHovered && (
              <>
                {/* Data stream animation */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute pointer-events-none"
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      y: [-10, -60],
                      x: Math.sin(i) * 20
                    }}
                    transition={{ 
                      duration: 1.2,
                      delay: i * 0.08,
                      repeat: Infinity,
                      repeatDelay: 0.5
                    }}
                  >
                    <span className="text-electric font-mono text-xs">
                      {Math.random() > 0.5 ? '1' : '0'}
                    </span>
                  </motion.div>
                ))}
              </>
            )}
          </AnimatePresence>
        );

      case 'cpu':
        return (
          <AnimatePresence>
            {isHovered && (
              <>
                {/* Neural network animation */}
                <svg
                  className="absolute inset-0 w-24 h-24 -left-6 -top-6 pointer-events-none"
                  viewBox="0 0 100 100"
                >
                  {[...Array(6)].map((_, i) => {
                    const angle = (i * 60) * Math.PI / 180;
                    const x1 = 50;
                    const y1 = 50;
                    const x2 = 50 + Math.cos(angle) * 30;
                    const y2 = 50 + Math.sin(angle) * 30;
                    
                    return (
                      <g key={i}>
                        <motion.line
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke="#FFB000"
                          strokeWidth="0.5"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ 
                            pathLength: [0, 1, 1, 0],
                            opacity: [0, 1, 1, 0]
                          }}
                          transition={{ 
                            duration: 2,
                            delay: i * 0.1,
                            ease: "easeInOut"
                          }}
                        />
                        <motion.circle
                          cx={x2}
                          cy={y2}
                          r="2"
                          fill="#FFB000"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ 
                            scale: [0, 1.5, 1, 0],
                            opacity: [0, 1, 1, 0]
                          }}
                          transition={{ 
                            duration: 2,
                            delay: i * 0.1 + 0.3,
                            ease: "easeInOut"
                          }}
                        />
                      </g>
                    );
                  })}
                </svg>
              </>
            )}
          </AnimatePresence>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      className={`relative ${className}`}
      onHoverStart={() => {
        setIsHovered(true);
        playSound();
      }}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className="w-10 h-10 border border-racing-silver/30 flex items-center justify-center hover:border-champagne transition-colors cursor-pointer relative overflow-visible">
        {icon}
        {renderAnimation()}
      </div>
      
      {/* Glow effect */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 -z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.5 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`
              w-full h-full blur-xl
              ${type === 'code' ? 'bg-champagne/20' : ''}
              ${type === 'database' ? 'bg-electric/20' : ''}
              ${type === 'cpu' ? 'bg-champagne/30' : ''}
            `} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};