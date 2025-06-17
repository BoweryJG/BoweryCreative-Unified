import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import audioManager from '../utils/audioManager';

interface AudioButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  soundFrequency?: number;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disableHoverSound?: boolean;
}

export const AudioButton: React.FC<AudioButtonProps> = ({ 
  children, 
  soundFrequency = 440,
  onClick,
  variant = 'secondary',
  disableHoverSound = false,
  ...props 
}) => {
  const handleClick = () => {
    // Only play click sound for primary buttons
    if (variant === 'primary') {
      audioManager.playClickSound();
    }
    onClick?.();
  };

  const handleHover = () => {
    // Only play hover sound for primary buttons and if not disabled
    if (variant === 'primary' && !disableHoverSound) {
      audioManager.playHoverSound(soundFrequency);
    }
  };

  return (
    <motion.button
      onHoverStart={handleHover}
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};