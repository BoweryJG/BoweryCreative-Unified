import React from 'react';

export const ParticleBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* CSS-only particle effect */}
      <div className="absolute inset-0 bg-gradient-radial from-champagne/10 via-electric/5 to-transparent opacity-20" />
      
      {/* Animated particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-champagne rounded-full animate-float opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
      
      {/* Moving grid lines */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-champagne to-transparent h-px top-1/4 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-electric to-transparent h-px top-3/4 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-champagne to-transparent w-px left-1/4 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-electric to-transparent w-px right-1/4 animate-pulse" style={{ animationDelay: '3s' }} />
      </div>
    </div>
  );
};