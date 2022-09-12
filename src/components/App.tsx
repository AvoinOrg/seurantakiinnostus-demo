import React from 'react';
import { ThemeProvider } from 'styled-components';
import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClient, QueryClientProvider } from 'react-query';

import { Theme, GlobalStyle } from '../styles';
import { StateProvider } from '../components/State';
import Main from './Main';

const queryClient = new QueryClient();

const App: React.FC<{}> = ({}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={Theme}>
        <GlobalStyle />
        <StateProvider>
          <Main></Main>
        </StateProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
