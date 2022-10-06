import React from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClient, QueryClientProvider } from 'react-query';
import { theme } from '../styles';
import { ThemeProvider } from '@mui/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { StateProvider } from '../components/State';
import Main from './Main';
import '../app.css';

const queryClient = new QueryClient();

const App: React.FC<{}> = ({}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <StateProvider>
          <Main></Main>
        </StateProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
