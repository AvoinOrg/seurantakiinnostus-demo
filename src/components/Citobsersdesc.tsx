import React,{useState,useEffect} from 'react';
import './Citobsers.css';

const dummyCitobsers = [
    '73452',
    '"API key account related right to perform an action (General priviledges): To submit information or annotations which are not automatically rejected, but either automatically accepted or left for further consideration. Typically latest submitted input from most priviledged API is considered for implementing the annotated action, and if the priviledge level of this API is sufficient, it is automatically executed. If API key account does not have this priviledge in the API priviledge selection, it is rejected (potentially even submission is not accepted). Special subsets for selection and priority levels for specific tasks -such as curation- can be defined separately For additional information, click ? button, ! will provide summaries on instructions and options or a reference for an instruction web page."    ',
];

const url = 'https://rajapinnat.ymparisto.fi/api/kansalaishavainnot/1.0/services.json?extension=true&service_code=api_privileges_general_service_code_en_202206071516241';

const fetchData = {
//   method: 'POST',
// body: JSON.stringify(datatest),
   headers: new Headers({
     'Content-Type': 'application/json',
     'Accept': 'application/json'
    })
}

function Citobsersdesc() {

    const [data,setData]=useState([]);
    const getData=()=>{
      fetch(url
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
        .then(function(myJson) {          
          setData(myJson)
        });
    }
    useEffect(()=>{
      getData()
    },[])
    return (
      <span className="cito-list">
       {/* {
        data.map((dat, index) => {
         return (
           <div key={0}>
                {dat}
           </div>
          );
        })} */}
        {dummyCitobsers[1]}       
      </span>
    );  
}

export default Citobsersdesc;