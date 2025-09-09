import { createTheme } from '@mui/material/styles';

// Enhanced theme with improved color contrast ratios for accessibility
export const accessibleTheme = createTheme({
  palette: {
    primary: {
      main: '#0d47a1', // Darker blue for better contrast (4.5:1 ratio)
      light: '#1976d2',
      dark: '#002171',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#d32f2f', // High contrast red
      light: '#f44336',
      dark: '#b71c1c',
      contrastText: '#ffffff'
    },
    text: {
      primary: '#212121', // High contrast dark gray (15.8:1 ratio)
      secondary: '#424242', // Medium contrast gray (9.7:1 ratio)
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff'
    },
    success: {
      main: '#2e7d32', // Darker green for better contrast
      light: '#4caf50',
      dark: '#1b5e20',
      contrastText: '#ffffff'
    },
    warning: {
      main: '#ed6c02', // Higher contrast orange
      light: '#ff9800',
      dark: '#e65100',
      contrastText: '#ffffff'
    },
    error: {
      main: '#d32f2f', // High contrast red
      light: '#f44336',
      dark: '#b71c1c',
      contrastText: '#ffffff'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      color: '#212121'
    },
    h2: {
      fontWeight: 700,
      color: '#212121'
    },
    h3: {
      fontWeight: 600,
      color: '#212121'
    },
    h4: {
      fontWeight: 600,
      color: '#212121'
    },
    h5: {
      fontWeight: 500,
      color: '#212121'
    },
    h6: {
      fontWeight: 500,
      color: '#212121'
    },
    body1: {
      color: '#212121'
    },
    body2: {
      color: '#424242'
    },
    button: {
      fontWeight: 600,
      textTransform: 'none'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
          textTransform: 'none',
          minHeight: 44, // Minimum touch target size
          '&:focus': {
            outline: '2px solid #0d47a1',
            outlineOffset: '2px'
          }
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
          }
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:focus-within': {
              outline: '2px solid #0d47a1',
              outlineOffset: '2px'
            }
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          '&:focus': {
            outline: '2px solid #0d47a1',
            outlineOffset: '2px'
          }
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 48, // Minimum touch target size
          fontWeight: 600,
          color: '#424242',
          '&.Mui-selected': {
            color: '#0d47a1',
            fontWeight: 700
          },
          '&:focus': {
            outline: '2px solid #0d47a1',
            outlineOffset: '2px'
          }
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          minWidth: 44, // Minimum touch target size
          minHeight: 44,
          '&:focus': {
            outline: '2px solid #0d47a1',
            outlineOffset: '2px'
          }
        }
      }
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#0d47a1',
          textDecoration: 'underline',
          '&:hover': {
            color: '#002171'
          },
          '&:focus': {
            outline: '2px solid #0d47a1',
            outlineOffset: '2px'
          }
        }
      }
    }
  }
});

export default accessibleTheme;
