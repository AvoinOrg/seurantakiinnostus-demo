import React from 'react';
import { ThemeProvider } from 'styled-components';

import { Theme, GlobalStyle } from '../styles';
import { StateProvider } from '../components/State';
import Main from './Main';

const App: React.FC<{}> = ({}) => {
  return (
    <ThemeProvider theme={Theme}>
      <GlobalStyle />
      <StateProvider>
        <Main></Main>
      </StateProvider>
    </ThemeProvider>
  );
};

export default App;
