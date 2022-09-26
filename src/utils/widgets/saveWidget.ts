const saveWidget = (apiKey, long, lat) => `
  <div class="CitObsO311Widget"
    data-type="SingleServiceQuestionnaire"
    data-service_code="csepin_intereststatus_service_code_en_202209161148489"
    data-show-service_name="true"
    data-show-service_description="true"
    data-show-map="true"
    data-map-height="300"
    data-show-obses="true"
    data-obses-max_age="10"
    data-obses-radius="6"
    data-obses-label="{ 'type': 'num', 'attribute': 'csepin_intereststatus_s_number_en_202209161148415' }"
    data-obses-color="{ 'type': 'cat', 'attribute': 'csepin_status_currentphase_singlevaluelist_en_202209161148423', 'values': [ { 'key': '1', 'color': 'green' }, { 'key': '2', 'color': 'blue' }, { 'key': '3', 'color': 'yellow' }, { 'key': '4', 'color': 'gray' }, { 'key': '5', 'color': 'red' } ] }"
    data-obses-cluster="false"
    data-show-questionnaire="true"
    data-images-count="0"
    data-api-key=${apiKey}
    data-observation_tags="#csepin, #monitoringinterest, #taskscore, #intereststatus, #api26, #taskscorecontroluipublic"
    data-long=${long}
    data-lat=${lat}
  ></div>`;

export default saveWidget;
