import { green, red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
import type {} from '@mui/x-data-grid/themeAugmentation';

// Create a theme instance.
const fontFamily = ['Roboto', 'Ubuntu', 'Merriweather', 'sans-serif'].join(',');
const theme = createTheme({
  palette: {
    primary: {
      main: '#000ba5',
      dark: '#148a0a',
      light: '#3ece125b',
      '500': '#25751d',
    },
    secondary: {
      main: '#19857b',
      dark: '#015255',
    },
    error: {
      main: red.A400,
    },
    success: {
      main: green.A700,
    },
  },
  typography: {
    fontFamily,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        html, body{
          font-family: ${fontFamily};
        }
      `,
    },
  },
  direction: 'ltr',
});

export default theme;
