import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1A6756',
      dark: '#0f5a61',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f27a23',
      contrastText: '#ffffff',
    },
    text: {
      primary: '#18454f',
      secondary: '#697286',
      disabled: '#94A3B8',
    },
    background: {
      default: '#e4e6eb',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Nunito Sans", "Segoe UI", sans-serif',
    h1: {
      fontFamily: '"Sora", sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Sora", sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Sora", sans-serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Sora", sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Sora", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Sora", sans-serif',
      fontWeight: 600,
    },
    button: {
      fontWeight: 700,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '8px 16px',
        },
      },
    },
  },
});
