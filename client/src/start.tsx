import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from './components/theme-provider';
import { AppDataProvider } from './contexts/app-data-context';

// createRoot(document.getElementById('root')!).render(
//   <ThemeProvider>
//     <App />
//   </ThemeProvider>
// );

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AppDataProvider>
        <App />
      </AppDataProvider>
    </ThemeProvider>
  </StrictMode>
);
