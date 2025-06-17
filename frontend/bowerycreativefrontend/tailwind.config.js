/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'obsidian': '#0A0A0A',
        'champagne': '#D4AF37',
        'racing-silver': '#C0C0C0',
        'arctic': '#FAFAFA',
        'electric': '#0080FF',
        'carbon': '#1C1C1C',
        'titanium': '#E5E5E5',
        'midnight': '#0F0F0F',
        'chrome': '#F5F5F5',
        'sapphire': '#0056B3',
        'graphite': '#2D2D2D',
        'platinum': '#E8E8E8',
      },
      fontFamily: {
        'display': ['Didot', 'Bodoni MT', 'Playfair Display', 'serif'],
        'sans': ['SF Pro Display', 'Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'massive': ['8rem', { lineHeight: '0.9' }],
        'hero': ['6rem', { lineHeight: '0.95' }],
        'display': ['4rem', { lineHeight: '1' }],
      },
      letterSpacing: {
        'refined': '0.02em',
        'luxury': '0.05em',
        'tech': '-0.02em',
        'wide': '0.1em',
      },
      backgroundImage: {
        'carbon-texture': "url('/textures/carbon.png')",
        'metallic-gradient': 'linear-gradient(135deg, #C0C0C0 0%, #808080 50%, #C0C0C0 100%)',
        'gold-shimmer': 'linear-gradient(135deg, #D4AF37 0%, #FFD700 25%, #D4AF37 50%, #B8860B 75%, #D4AF37 100%)',
        'obsidian-gradient': 'radial-gradient(ellipse at center, #1C1C1C 0%, #0A0A0A 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'glitch': 'glitch 2s infinite',
        'shimmer': 'shimmer 3s infinite',
        'pulse-glow': 'pulseGlow 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(50px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(212, 175, 55, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}