import React from 'react';

const Citobsers = (props) => {
    return (
        <li>
            <p>{props.service_request_id}</p>
            <p>{props.description}</p>
        </li>
    )
}

export default Citobsers;