// theme.js
import { createTheme } from '@mui/material/styles';
import darkTheme from './themes/dark';
import lightTheme from './themes/light';

const theme = (mode) => {
  switch (mode) {
    case 'dark':
      return createTheme(darkTheme);
    case 'light':
      return createTheme(lightTheme);
    default:
      return createTheme(lightTheme);
  }
};

export default theme;