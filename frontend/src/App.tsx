import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { store } from './store';
import { createPOSTheme } from './theme/posTheme';
import { useTheme } from './store/hooks/useUI';
import { useAutoLogin } from './store/hooks/useAuth';
import POSDemo from './pages/POSDemo';

// Theme wrapper component
const ThemedApp: React.FC = () => {
  const { darkMode } = useTheme();
  const { attemptAutoLogin, shouldAttemptAutoLogin } = useAutoLogin();
  const theme = createPOSTheme(darkMode);

  useEffect(() => {
    if (shouldAttemptAutoLogin) {
      attemptAutoLogin();
    }
  }, [shouldAttemptAutoLogin, attemptAutoLogin]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <POSDemo />
    </ThemeProvider>
  );
};

// Main App component with Redux Provider
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemedApp />
    </Provider>
  );
};

export default App;