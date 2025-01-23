import React from 'react';
import useThemeStore from '../store/themeStore';
import { Box, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useThemeStore();
    
  return (
    <Box display="flex" justifyContent="flex-end" padding={2}>
      <IconButton onClick={toggleTheme} color="inherit">
        {theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Box>
  );
};

export default ThemeSwitcher;
