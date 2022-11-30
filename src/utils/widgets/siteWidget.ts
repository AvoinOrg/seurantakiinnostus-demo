import baseWidget from './baseWidget';

const siteWidget = (apiKey, extraParams) => {
  const serviceId = 'csepin_staticobservationsite_service_code_202111191120569';

  const widgetParams = `
    data-type="SingleServiceQuestionnaire"
    data-show-service_name="true"
    data-show-service_description="true"
    data-show-map="true"
    data-map-height="300"
    data-show-obses="true"
    data-obses-max_age="90"
    data-obses-radius="9"
    data-obses-label=""
    data-obses-color=""
    data-obses-cluster="true"
    data-show-questionnaire="true"
    data-images-count="2"
  `;

  return baseWidget(serviceId, apiKey, widgetParams, extraParams);
};

export default siteWidget;
