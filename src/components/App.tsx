import React from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClient, QueryClientProvider } from 'react-query';
import { theme } from '../styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StylesProvider, ThemeProvider } from '@mui/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { StateProvider } from '../components/State';
import Main from './Main';

const queryClient = new QueryClient();

const App: React.FC<{}> = ({}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <StylesProvider>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <CssBaseline />
            <StateProvider>
              <Main></Main>
            </StateProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </StylesProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
