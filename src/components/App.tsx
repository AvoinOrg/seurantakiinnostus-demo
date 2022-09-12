import React, { useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import CitobserList from './CitobsersList';

import { Theme, GlobalStyle } from '../styles';
import { StateProvider } from '../components/State';
import Main from './Main';

const App: React.FC<{}> = ({}) => {
  
  const [citobsers, setCitobservs] = useState();

  function citizenObservationHandler() {
    fetch('https://rajapinnat.ymparisto.fi/api/kansalaishavainnot/1.0/services.json')
      .then(response => {
        return response.json();
      })
      .then(data => {
        const transformedCitobsers = data.map((citizenData) => {
          return {
            extension: citizenData.extension = true,
            service_code: citizenData.service_code = 'api_privileges_general_service_code_en_202206071516241',
            description: citizenData.description
          };  
      });
      setCitobservs(transformedCitobsers);
    });
  }
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
