import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light', // Ensure we are in light mode
    primary: {
      main: '#1976d2', // Adjust primary color for light theme
    },
    secondary: {
      main: '#f50057', // Adjust secondary color for light theme
    },
    background: {
      default: '#ffffff', // Set default background color for light theme
      paper: '#f5f5f5', // Set paper background color for light theme
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#f5f5f5', // Adjust drawer background color
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff', // Adjust app bar background color
        },
      },
    },
  },
});

export default theme;
