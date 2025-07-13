import { createTheme } from '@mui/material/styles';

// Bowery Creative color palette
export const colors = {
  obsidian: '#0a0a0a',
  carbon: '#1a1a1a',
  graphite: '#2a2a2a',
  titanium: '#404040',
  racingSilver: '#808080',
  arctic: '#ffffff',
  champagne: '#d4af37',
  electric: '#00ff00',
  error: '#ff4444',
  warning: '#ffaa00',
  success: '#00cc66',
};

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.champagne,
      light: '#e4c547',
      dark: '#b8941f',
    },
    secondary: {
      main: colors.electric,
      light: '#33ff33',
      dark: '#00cc00',
    },
    background: {
      default: colors.obsidian,
      paper: colors.carbon,
    },
    text: {
      primary: colors.arctic,
      secondary: colors.racingSilver,
    },
    divider: colors.graphite,
    error: {
      main: colors.error,
    },
    warning: {
      main: colors.warning,
    },
    success: {
      main: colors.success,
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: colors.arctic,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: colors.arctic,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      color: colors.arctic,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: colors.arctic,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: colors.arctic,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      color: colors.arctic,
    },
    body1: {
      color: colors.arctic,
    },
    body2: {
      color: colors.racingSilver,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: colors.carbon,
          border: `1px solid ${colors.graphite}`,
          borderRadius: 12,
          '&:hover': {
            borderColor: colors.champagne,
            boxShadow: `0 0 20px ${colors.champagne}20`,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          backgroundColor: colors.champagne,
          color: colors.obsidian,
          '&:hover': {
            backgroundColor: '#e4c547',
            boxShadow: `0 0 20px ${colors.champagne}40`,
          },
        },
        outlined: {
          borderColor: colors.champagne,
          color: colors.champagne,
          '&:hover': {
            backgroundColor: `${colors.champagne}10`,
            borderColor: colors.champagne,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: colors.carbon,
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.carbon,
          borderBottom: `1px solid ${colors.graphite}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.carbon,
          borderRight: `1px solid ${colors.graphite}`,
        },
      },
    },
  },
});