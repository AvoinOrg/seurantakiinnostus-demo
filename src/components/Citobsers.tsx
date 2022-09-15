import React from 'react';

const Citobsers = (props) => {
    return (
        <li>
            <p>{props.service_code}</p><br/>
            <p>{props.description}</p>
        </li>
    )
}

export default Citobsers;