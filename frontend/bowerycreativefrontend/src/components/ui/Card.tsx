import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

interface CardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  hover?: 'lift' | 'glow' | 'tilt';
  gradient?: 'subtle' | 'bold' | 'dark';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, hover = 'lift', gradient = 'subtle', ...props }, ref) => {
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (hover !== 'tilt') return;
      
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
      setMousePosition({ x, y });
    };

    const handleMouseLeave = () => {
      setMousePosition({ x: 0, y: 0 });
    };

    const gradients = {
      subtle: 'from-elegant-cream/30 to-elegant-white/30',
      bold: 'from-elegant-accent/20 to-elegant-cream/50',
      dark: 'from-elegant-white to-elegant-cream/80',
    };

    const hoverEffects = {
      lift: { y: -8, transition: { duration: 0.3 } },
      glow: { boxShadow: '0 0 40px rgba(201, 169, 97, 0.3)', transition: { duration: 0.3 } },
      tilt: { rotateX: mousePosition.y, rotateY: mousePosition.x, transition: { duration: 0.1 } },
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          'relative overflow-hidden rounded-lg p-8',
          'bg-gradient-to-br backdrop-blur-sm',
          'border border-elegant-accent/10',
          'transition-all duration-500',
          'hover:border-elegant-accent/30',
          gradients[gradient],
          className
        )}
        whileHover={hoverEffects[hover]}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ transformStyle: 'preserve-3d' }}
        {...props}
      >
        <div className="relative z-10">{children}</div>
        <div className="absolute inset-0 bg-gradient-radial opacity-0 transition-opacity duration-500 hover:opacity-100" />
      </motion.div>
    );
  }
);

Card.displayName = 'Card';