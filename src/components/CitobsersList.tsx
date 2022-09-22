import React from 'react';

import Citobsers from './Citobsers';
import './Citobsers.css';

const CitobsersList = (props) => {
  return (
    <ul className="cito-list">      
      {props.items.map(data => (
        <Citobsers
          service_code={data.service_code}          
        >
          {data.description}
        </Citobsers>
      ))}
    </ul>
  );
};

export default CitobsersList;