import { createTheme, type PaletteColorOptions, type PaletteColor } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    magic: PaletteColor;
    surface: PaletteColor;
    reportAction: PaletteColor;
  }
  interface PaletteOptions {
    magic?: PaletteColorOptions;
    surface?: PaletteColorOptions;
    reportAction?: PaletteColorOptions;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    magic: true;
  }
}
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
    warning: {
      main: '#FFD700',
    },
    info: {
      main: '#3b82f6',
    },
    background: {
      default: '#f7f9fc',
      paper: '#ffffff',
    },
    magic: {
      main: '#6f4ef2',
      contrastText: '#ffffff',
    },
    surface: {
      main: '#f0f2f4',
      dark: '#d5d8df',
    },
    reportAction: {
      main: '#2c405a',
      contrastText: '#ffffff',
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
          borderRadius: '12px',
          padding: '12px 16px',
          fontWeight: 700,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: '#ffffff',
          },
        },
      },
    },
  },
});
