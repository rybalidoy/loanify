import './bootstrap';
import { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Router from './routes/router';
import { CssBaseline } from '@mui/material';

const queryClient = new QueryClient();

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <CssBaseline enableColorScheme />
        <Suspense fallback={<div>Loading...</div>}>
          <Router />
        </Suspense>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

if (document.getElementById('app')) {
  createRoot(document.getElementById('app')).render(<App />);
}
