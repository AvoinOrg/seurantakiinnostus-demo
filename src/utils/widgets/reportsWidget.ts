import baseWidget from './baseWidget';

const reportsWidget = (apiKey, latLonZoom, extraParams) => {
  const latLonZoomJson = JSON.stringify(latLonZoom);
  const serviceId = 'csepin_localreport_service_code_en_202210171609144';

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
    data-map-center-lat-lon-zoom=${latLonZoomJson}
  `;

  return baseWidget(serviceId, apiKey, widgetParams, extraParams);
};

export default reportsWidget;
