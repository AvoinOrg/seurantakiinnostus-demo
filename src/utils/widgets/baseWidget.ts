const baseWidget = (serviceId: string, apiKey, widgetParams, extraParams) => {
  let extra = '';
  for (const key in extraParams) {
    extra += ` ${key}="${String(extraParams[key])}"`;
  }
  const start = `
    <div class="CitObsO311Widget"
        data-service_code="${serviceId}"
        data-api-key="${apiKey}" 
    `;
  const end = ' ></div>';

  return start + extra + widgetParams + end;
};

export default baseWidget;
