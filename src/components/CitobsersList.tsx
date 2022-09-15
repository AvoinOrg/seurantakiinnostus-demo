import React from 'react';

import Citobsers from './Citobsers';

const CitobsersList = (props) => {
  return (
    <ul>
      {props.datas.map((data) => (
        <Citobsers
          service_code={data.service_code}
          description={data.description}          
        />
      ))}
    </ul>
  );
};

export default CitobsersList;