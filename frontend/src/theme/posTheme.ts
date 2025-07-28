import { createTheme, ThemeOptions } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

// CoralServe brand colors
const coralServeColors = {
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  success: '#2ECC71',
  warning: '#F39C12',
  error: '#E74C3C',
  info: '#3498DB',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  text: {
    primary: '#2C3E50',
    secondary: '#7F8C8D',
  },
};

export const createPOSTheme = (isDarkMode: boolean = false): ThemeOptions => ({
  palette: {
    mode: isDarkMode ? 'dark' : 'light',
    primary: {
      main: coralServeColors.primary,
      light: '#FF8E8E',
      dark: '#E55A5A',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: coralServeColors.secondary,
      light: '#6ED5CD',
      dark: '#3DB8B0',
      contrastText: '#FFFFFF',
    },
    success: {
      main: coralServeColors.success,
    },
    warning: {
      main: coralServeColors.warning,
    },
    error: {
      main: coralServeColors.error,
    },
    info: {
      main: coralServeColors.info,
    },
    background: {
      default: isDarkMode ? '#121212' : coralServeColors.background,
      paper: isDarkMode ? '#1E1E1E' : coralServeColors.surface,
    },
    text: {
      primary: isDarkMode ? '#FFFFFF' : coralServeColors.text.primary,
      secondary: isDarkMode ? '#B0B0B0' : coralServeColors.text.secondary,
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontWeight: 600,
        },
        contained: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: isDarkMode ? '#2C2C2C' : '#F8F9FA',
            borderBottom: '2px solid rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 600,
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontSize: '0.75rem',
          fontWeight: 600,
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
        },
      },
    },
  },
});

export const usePOSTheme = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  return createPOSTheme(prefersDarkMode);
};