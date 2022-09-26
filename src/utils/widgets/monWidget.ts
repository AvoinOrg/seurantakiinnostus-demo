const monWidget = (serviceId: string, apiKey) => `
  <div class="CitObsO311Widget"
    data-type="SingleServiceQuestionnaire"
    data-service_code="${serviceId}"
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
    data-api-key="${apiKey}"
  ></div>`;

export default monWidget;
