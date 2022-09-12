import React from 'react';

import Citobser from './Citobser';

const CitobsersList = (props) => {
  return (
    <ul>
      {props.citobsers.map((citobser) => (
        <Citobser
          service_request_id={citobser.description}
          description={citobser.description}          
        />
      ))}
    </ul>
  );
};

export default CitobsersList;