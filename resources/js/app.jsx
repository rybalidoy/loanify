import './bootstrap';
import { Suspense, useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Router from './routes/router';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from './config/theme';
import useThemeStore from './store/themeStore';

const queryClient = new QueryClient();

const App = () => {
  const { theme: mode } = useThemeStore();
  
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme(mode)}>
          <CssBaseline enableColorScheme />
          <Suspense fallback={<div>Loading...</div>}>
            <Router />
          </Suspense>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

if (document.getElementById('app')) {
  createRoot(document.getElementById('app')).render(<App />);
}
