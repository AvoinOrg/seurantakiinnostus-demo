import React, { useEffect, useState, useCallback } from 'react';
import { ThemeProvider } from 'styled-components';

import { Theme, GlobalStyle } from '../styles';
import { StateProvider } from '../components/State';
import Main from './Main';


function App() {
  const [data,setData]=useState([]);   
  const getData=()=>{
    fetch('https://rajapinnat.ymparisto.fi/api/kansalaishavainnot/1.0/services.json'
    ,{
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    }
    )
      .then(function(response){
        return response.json();
      })
      .then(function(datas) {
        setData(datas)
      });
  }
  useEffect(()=>{
    getData()
  },[])

  return (
    <ThemeProvider theme={Theme}>
      <GlobalStyle />
        <StateProvider>
          <Main></Main>
        </StateProvider>
    </ThemeProvider>     
  );
}

export default App;
