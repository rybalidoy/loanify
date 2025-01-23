import { extendTheme } from "@mui/material";

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#00ADB5', // Primary color
        },
        background: {
          default: '#EEEEEE', // Background color
          primary: '#393E46',
          paper: '#FFFFFF', // Paper color
        },
        text: {
          primary: '#222831',
          secondary: '#393E46',
          light: '#EEEEEE',
          error: '#FF0000', // Error color
        },
        action: {
          active: '#00ADB5', // Custom active link color
          selected: '#a9a9a99c',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: '#00ADB5', // Primary color
        },
        background: {
          default: '#222831', // Background color
          paper: '#393E46', // Paper color
        },
        text: {
          primary: '#EEEEEE', // Primary text color
          secondary: '#00ADB5', // Secondary text color
        },
        action: {
          active: '#00ADB5', // Custom active link color
        },
      },
    },
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
    h1: {
      fontFamily: 'Poppins, Arial, sans-serif',
    },
    h2: {
      fontFamily: 'Poppins, Arial, sans-serif',
    },
    h3: {
      fontFamily: 'Poppins, Arial, sans-serif',
    },
    body1: {
      fontFamily: 'Inter, Arial, sans-serif',
    },
    body2: {
      fontFamily: 'Inter, Arial, sans-serif',
    },
  },
});

export default theme;
