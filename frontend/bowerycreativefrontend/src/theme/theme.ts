import { createTheme } from '@mui/material/styles';

export const colors = {
  // Primary Colors
  champagne: '#fbbf24',
  obsidian: '#0a0a0a',
  arctic: '#ffffff',
  carbon: '#1a1a1a',
  graphite: '#2a2a2a',
  racingSilver: '#9ca3af',
  
  // Additional colors
  primary: '#fbbf24',
  secondary: '#f97316',
  background: {
    default: '#0a0a0a',
    paper: '#1a1a1a',
  },
};

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.primary,
    },
    secondary: {
      main: colors.secondary,
    },
    background: {
      default: colors.background.default,
      paper: colors.background.paper,
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});