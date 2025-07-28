import { createTheme, ThemeOptions } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

// Enhanced CoralServe brand colors with better contrast and accessibility
const coralServeColors = {
  primary: {
    main: '#FF6B6B',
    light: '#FF8E8E',
    dark: '#E55A5A',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#4ECDC4',
    light: '#6ED5CD',
    dark: '#3DB8B0',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#2ECC71',
    light: '#58D68D',
    dark: '#27AE60',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#F39C12',
    light: '#F7DC6F',
    dark: '#D68910',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#E74C3C',
    light: '#EC7063',
    dark: '#C0392B',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#3498DB',
    light: '#5DADE2',
    dark: '#2980B9',
    contrastText: '#FFFFFF',
  },
  grey: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  background: {
    default: '#F8F9FA',
    paper: '#FFFFFF',
    surface: '#FFFFFF',
    elevated: '#FFFFFF',
  },
  text: {
    primary: '#1A1A1A',
    secondary: '#666666',
    disabled: '#BDBDBD',
  },
  divider: 'rgba(0, 0, 0, 0.08)',
};

// Enhanced typography scale
const typography = {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  h1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h6: {
    fontSize: '1.125rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  subtitle1: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  subtitle2: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.6,
    fontWeight: 400,
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.5,
    fontWeight: 400,
  },
  button: {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.875rem',
    lineHeight: 1.5,
  },
  caption: {
    fontSize: '0.75rem',
    lineHeight: 1.4,
    fontWeight: 400,
  },
  overline: {
    fontSize: '0.75rem',
    lineHeight: 1.4,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
};

// Enhanced spacing and shape
const spacing = 8;
const shape = {
  borderRadius: 12,
  borderRadiusSm: 8,
  borderRadiusMd: 12,
  borderRadiusLg: 16,
  borderRadiusXl: 20,
};

// Enhanced shadows
const shadows = [
  'none',
  '0px 1px 2px rgba(0, 0, 0, 0.05)',
  '0px 2px 4px rgba(0, 0, 0, 0.05)',
  '0px 4px 8px rgba(0, 0, 0, 0.05)',
  '0px 8px 16px rgba(0, 0, 0, 0.05)',
  '0px 16px 32px rgba(0, 0, 0, 0.05)',
  '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
  '0px 4px 6px rgba(0, 0, 0, 0.1), 0px 2px 4px rgba(0, 0, 0, 0.06)',
  '0px 10px 15px rgba(0, 0, 0, 0.1), 0px 4px 6px rgba(0, 0, 0, 0.05)',
  '0px 20px 25px rgba(0, 0, 0, 0.1), 0px 10px 10px rgba(0, 0, 0, 0.04)',
  '0px 25px 50px rgba(0, 0, 0, 0.1), 0px 10px 20px rgba(0, 0, 0, 0.05)',
  '0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)',
  '0px 3px 6px rgba(0, 0, 0, 0.16), 0px 3px 6px rgba(0, 0, 0, 0.23)',
  '0px 10px 20px rgba(0, 0, 0, 0.19), 0px 6px 6px rgba(0, 0, 0, 0.23)',
  '0px 14px 28px rgba(0, 0, 0, 0.25), 0px 10px 10px rgba(0, 0, 0, 0.22)',
  '0px 19px 38px rgba(0, 0, 0, 0.30), 0px 15px 12px rgba(0, 0, 0, 0.22)',
  '0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)',
  '0px 3px 6px rgba(0, 0, 0, 0.16), 0px 3px 6px rgba(0, 0, 0, 0.23)',
  '0px 10px 20px rgba(0, 0, 0, 0.19), 0px 6px 6px rgba(0, 0, 0, 0.23)',
  '0px 14px 28px rgba(0, 0, 0, 0.25), 0px 10px 10px rgba(0, 0, 0, 0.22)',
  '0px 19px 38px rgba(0, 0, 0, 0.30), 0px 15px 12px rgba(0, 0, 0, 0.22)',
  '0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)',
  '0px 3px 6px rgba(0, 0, 0, 0.16), 0px 3px 6px rgba(0, 0, 0, 0.23)',
  '0px 10px 20px rgba(0, 0, 0, 0.19), 0px 6px 6px rgba(0, 0, 0, 0.23)',
  '0px 14px 28px rgba(0, 0, 0, 0.25), 0px 10px 10px rgba(0, 0, 0, 0.22)',
  '0px 19px 38px rgba(0, 0, 0, 0.30), 0px 15px 12px rgba(0, 0, 0, 0.22)',
];

export const createPOSTheme = (isDarkMode: boolean = false): ThemeOptions => ({
  palette: {
    mode: isDarkMode ? 'dark' : 'light',
    primary: coralServeColors.primary,
    secondary: coralServeColors.secondary,
    success: coralServeColors.success,
    warning: coralServeColors.warning,
    error: coralServeColors.error,
    info: coralServeColors.info,
    grey: coralServeColors.grey,
    background: {
      default: isDarkMode ? '#121212' : coralServeColors.background.default,
      paper: isDarkMode ? '#1E1E1E' : coralServeColors.background.paper,
    },
    text: {
      primary: isDarkMode ? '#FFFFFF' : coralServeColors.text.primary,
      secondary: isDarkMode ? '#B0B0B0' : coralServeColors.text.secondary,
      disabled: isDarkMode ? '#666666' : coralServeColors.text.disabled,
    },
    divider: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : coralServeColors.divider,
  },
  typography,
  shape,
  spacing,
  shadows,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: shape.borderRadiusSm,
          padding: '12px 24px',
          fontWeight: 600,
          fontSize: '0.875rem',
          textTransform: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: shadows[4],
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          boxShadow: shadows[2],
          '&:hover': {
            boxShadow: shadows[4],
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
        text: {
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
        sizeSmall: {
          padding: '8px 16px',
          fontSize: '0.75rem',
        },
        sizeLarge: {
          padding: '16px 32px',
          fontSize: '1rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: shape.borderRadiusMd,
          boxShadow: shadows[2],
          border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.05)'}`,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: shadows[4],
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: shape.borderRadiusMd,
        },
        elevation1: {
          boxShadow: shadows[2],
        },
        elevation2: {
          boxShadow: shadows[4],
        },
        elevation3: {
          boxShadow: shadows[6],
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: shape.borderRadiusSm,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: coralServeColors.primary.main,
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: coralServeColors.primary.main,
                borderWidth: 2,
              },
            },
          },
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
          borderRadius: shape.borderRadiusMd,
          overflow: 'hidden',
          '& .MuiDataGrid-cell': {
            borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.05)'}`,
            padding: '16px',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: isDarkMode ? '#2C2C2C' : coralServeColors.grey[50],
            borderBottom: `2px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)'}`,
            '& .MuiDataGrid-columnHeader': {
              padding: '16px',
            },
          },
          '& .MuiDataGrid-row': {
            '&:hover': {
              backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: shape.borderRadiusLg,
          fontWeight: 600,
          fontSize: '0.75rem',
          height: '24px',
          '& .MuiChip-label': {
            padding: '0 12px',
          },
        },
        sizeSmall: {
          height: '20px',
          fontSize: '0.625rem',
        },
        sizeMedium: {
          height: '28px',
          fontSize: '0.875rem',
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontSize: '0.75rem',
          fontWeight: 600,
          height: '20px',
          minWidth: '20px',
          borderRadius: '10px',
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: shadows[6],
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: shadows[8],
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: shape.borderRadiusLg,
          boxShadow: shadows[12],
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
          boxShadow: shadows[8],
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: shadows[2],
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: shape.borderRadiusSm,
          margin: '4px 8px',
          '&:hover': {
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: shape.borderRadiusSm,
          margin: '4px 8px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
            transform: 'translateX(4px)',
          },
          '&.Mui-selected': {
            backgroundColor: isDarkMode ? 'rgba(255, 107, 107, 0.2)' : 'rgba(255, 107, 107, 0.1)',
            '&:hover': {
              backgroundColor: isDarkMode ? 'rgba(255, 107, 107, 0.3)' : 'rgba(255, 107, 107, 0.15)',
            },
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: shape.borderRadiusSm,
          fontSize: '0.875rem',
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiAlert-root': {
            borderRadius: shape.borderRadiusSm,
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          borderRadius: shape.borderRadiusSm,
          boxShadow: shadows[4],
          border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)'}`,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: shape.borderRadiusSm,
          boxShadow: shadows[4],
          border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)'}`,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: shape.borderRadiusSm,
          fontSize: '0.75rem',
          padding: '8px 12px',
        },
      },
    },
  },
});

export const usePOSTheme = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  return createPOSTheme(prefersDarkMode);
};