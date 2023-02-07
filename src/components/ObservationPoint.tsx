import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import L from 'leaflet';
import { Marker, Popup, Circle, GeoJSON } from 'react-leaflet';
import { getUnixTime } from 'date-fns';

import { theme } from '../styles';
import { tsToString, tsToCitobString } from '../utils/helpers';
import { StateContext } from '../components/State';
import monWidget from '../utils/widgets/monWidget';
import saveWidget from '../utils/widgets/saveWidget';

interface Props {
  ob: any;
}

const NO_COLOR = 'gray';
const COLORS = ['#0eb51f', '#afde16', '#dce312', '#de8716', '#b5110e'];
const LEVEL_OF_NEED = ['very low', 'low', 'medium', 'high', 'very high'];

const ObservationPoint: React.FC<Props> = (props: Props) => {
  const [renderSettings, setRenderSettings] = useState<any>(null);
  const [drawIndicator, setDrawIndicator] = useState<boolean>(false);

  const {
    handleModalClick,
    apiKey,
    controlUiEnabled,
    extraParams,
    UIPriorityLevel,
    selectedDate,
    viewParamsRef,
  }: any = useContext(StateContext);
  const position: any = [props.ob.lat, props.ob.long];

  useEffect(() => {
    let color: string;
    let size: number;
    const settings: any = {};
    if (props.ob.radius !== undefined) {
      let p = props.ob.s;
      !props.ob.Spmin && (props.ob.Spmin = 0);
      !props.ob.Spmax && (props.ob.Spmax = 100);

      const diff = Math.abs(props.ob.Spmin - props.ob.Spmax);
      if (props.ob.Spmin <= props.ob.Spmax) {
        p = p - props.ob.Spmin;
        p = Math.max(Math.min(p / diff, 1), 0);
      } else {
        p = p - props.ob.Spmax;
        p = Math.max(Math.min(1 - p / diff, 1), 0);
      }

      p *= 100;

      settings.p = p;
      settings.s = props.ob.s;
      settings.phase = props.ob.phase;
      const index = Math.max(Math.min(Math.floor(p / (100 / 5)), 4), 0);

      if (p > 0) {
        color = COLORS[index];
        settings.levelOfNeed = LEVEL_OF_NEED[index];
        size = 50 + index * 4;
      } else {
        color = "gray";
        settings.levelOfNeed = 'none';
        size = 40;
      }

      settings.icon = L.divIcon({
        className: 'pin',
        iconAnchor: [size / 2, size - 9],
        popupAnchor: [0, (size - 20) * -1],
        html: `<svg xmlns="http://www.w3.org/2000/svg" 
            width="${size}" 
            height="${size}" 
            viewBox="0 0 24 24"
            fill="${color}"
            fill-opacity="${settings.s <= 0 ? 0.2 : 0.8}"
            stroke-opacity="${settings.s <= 0 ? 0.4 : 1}" 
            stroke="black" 
            stroke-width="1.5" stroke-linecap="round" 
            stroke-linejoin="round" 
            class="feather feather-map-pin">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle></svg>`,
      });
    } else {
      size = 44;
      color = NO_COLOR;
      settings.levelOfNeed = 'not specified';
      settings.icon = L.divIcon({
        className: 'pin',
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -10],
        html: `<svg xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 512 512"
          width="${size}" 
          height="${size}"
          stroke="black"
          fill="black"
          stroke-width="1" 
          stroke-linecap="round"
          ><path d="M405 136.798L375.202 107 256 226.202 136.798 107 107 136.798 226.202 256 107 375.202 136.798 405 256 285.798 375.202 405 405 375.202 285.798 256z"/></svg>`,
      });
    }

    settings.color = color;
    setRenderSettings(settings);
  }, [props.ob]);

  const handleMonClick = () => {
    const newWidget = monWidget(
      props.ob.serviceId,
      apiKey,
      [
        viewParamsRef.current.lat,
        viewParamsRef.current.lon,
        viewParamsRef.current.zoom,
      ],
      extraParams.citobsParams,
    );
    handleModalClick(props.ob.serviceId, newWidget);
  };

  const handleSaveClick = () => {
    const defaultValues: any = {
      csepin_intereststatus_s_number_en_202209161148415: renderSettings.s,
      csepin_intereststatus_P_number_202209161148417: renderSettings.p,
      observationtime: getUnixTime(selectedDate),
      // csepin_intereststatus_reqscname_string_en_202209161148412:
      //   renderSettings.code,
      csepin_intereststatus_reqsc_string_en_202209161148414: props.ob.serviceId,
      csepin_intereststatus_siteid_string_en_202209161148418: props.ob.id,
    };

    if (props.ob.lastObDate != undefined) {
      defaultValues.csepin_intereststatus_to_string_en_202209161148420 =
        tsToCitobString(props.ob.lastObDate);
    }

    const newWidget = saveWidget(
      apiKey,
      defaultValues,
      [...position, 16],
      extraParams.citobsParams,
    );

    handleModalClick(props.ob.serviceId, newWidget);
  };

  const handlePopupOpen = () => {
    setDrawIndicator(true);
  };

  const handlePopupClose = () => {
    setDrawIndicator(false);
  };

  return (
    <>
      {renderSettings && (
        <>
          {props.ob.radius && drawIndicator && (
            <Circle
              center={position}
              radius={props.ob.radius}
              color={'black'}
              fillColor={renderSettings.color}
              weight={1}
              opacity={0.6}
              fillOpacity={0.65}
            />
          )}
          {drawIndicator && props.ob.lake && (
            <GeoJSON
              data={props.ob.lake}
              style={{
                color: renderSettings.color,
                weight: 8,
                opacity: 0.55,
              }}
            />
          )}
          (
          <Point
            position={position}
            icon={renderSettings.icon}
            eventHandlers={{
              popupopen: handlePopupOpen,
              popupclose: handlePopupClose,
            }}
          >
            <Tooltip>
              {renderSettings.levelOfNeed != null && (
                <>
                  <Header>
                    Need of observation in the area:{' '}
                    <span style={{ color: renderSettings.color }}>
                      <b>{renderSettings.levelOfNeed}</b>
                    </span>{' '}
                    <br />
                  </Header>
                </>
              )}
              {props.ob.serviceId && (
                <Button onClick={handleMonClick}>Add observation</Button>
              )}
              <hr style={{ margin: '15px 0 15px 0' }} />
              {props.ob.serviceName != null && (
                <Field>
                  <b>Monitoring service name:</b>
                  {'  ' + props.ob.serviceName}
                </Field>
              )}
              {props.ob.serviceId != null && (
                <Field>
                  <b>Monitoring service id:</b>
                  {'  ' + props.ob.serviceId}
                </Field>
              )}
              {props.ob.serviceDescription != null && (
                <Field>
                  <b>Monitoring service description:</b>
                  {'  ' + props.ob.serviceDescription}
                </Field>
              )}
              {/* {props.ob.serviceKeywords != null && (
                <Field>
                  <b>Monitoring service keywords:</b>
                  {'  ' + props.ob.serviceKeywords.join(', ')}
                </Field>
              )}
              {props.ob.hashtags != null && (
                <Field>
                  <b>Related hashtags:</b>
                  {'  ' + props.ob.hashtags.join(', ')}
                </Field>
              )} */}
              {props.ob.created != null && (
                <Field>
                  <b>Beginning of monitoring interest:</b>
                  {(() => {
                    return '  ' + tsToString(props.ob.created);
                  })()}
                </Field>
              )}
              {props.ob.t0 != null && props.ob.created != null && (
                <Field>
                  <b>Latest triggering of interest:</b>
                  {(() => {
                    if (props.ob.trigger) {
                      return '  ' + tsToString(props.ob.t0);
                    } else {
                      return '  ---';
                    }
                  })()}
                </Field>
              )}
              {props.ob.s != null && (
                <Field>
                  <b>Latest observation:</b>
                  {(() => {
                    if (props.ob.lastObDate != null) {
                      return '  ' + tsToString(props.ob.lastObDate);
                    } else {
                      return '  ---';
                    }
                  })()}
                </Field>
              )}
              {props.ob.count != null && (
                <Field>
                  <b>
                    Observations in the area after the beginning of monitoring
                    interest:
                  </b>
                  {'  ' + props.ob.count}
                </Field>
              )}
              {renderSettings.s != null && (
                <Field>
                  <b>Monitoring interest (S):</b>
                  {'  ' + renderSettings.s.toFixed(2)}
                </Field>
              )}
              {renderSettings.p != null && (
                <Field>
                  <b>Scaled monitoring interest (P):</b>
                  {'  ' + renderSettings.p.toFixed(2) + '%'}
                </Field>
              )}
              {props.ob.phase != null && (
                <Field>
                  <b>Current phase of monitoring interest:</b>
                  {'  ' +
                    (() => {
                      switch (renderSettings.phase) {
                        case 'validation':
                          return 'validation';
                        case 'similarity':
                          return 'similarity';
                        case 'reobservation':
                          return 'reobservation';
                        default:
                          return 'basic';
                      }
                    })()}
                </Field>
              )}
              {props.ob.serviceId &&
                controlUiEnabled &&
                UIPriorityLevel >= 2 && (
                  <Button onClick={handleSaveClick}>
                    Save monitoring interest status
                  </Button>
                )}
            </Tooltip>
          </Point>
          )
        </>
      )}
    </>
  );
};

const Point: any = styled(Marker)``;

const Tooltip: any = styled(Popup)`
  flex: 1;
  flex-direction: column;
  }
`;

const Header: any = styled.p`
  font-size: 1.2rem;
  margin: 0 !important;
`;

const Field: any = styled.p`
  font-size: 0.8rem;
  line-height: 1rem;
  margin: 8px 0 0 0 !important;
`;

const Button: any = styled.p`
  font-size: 1rem;
  line-height: 1rem;
  margin: 15px auto 0 auto !important;
  border-radius: 5px;
  padding: 10px;
  text-align: center;
  background: ${theme.palette.primary.main};
  &:hover {
    cursor: pointer;
  }
`;

export default ObservationPoint;
