import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  useMap,
  useMapEvents,
  Marker,
  Popup,
  TileLayer,
  WMSTileLayer,
  GeoJSON,
  MapContainer,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.vectorgrid';
import { useQuery, useQueryClient } from 'react-query';
import _ from 'lodash';

import { theme } from '../styles';
import {
  getObservationPoints,
  getMonitoringInterestDefs,
  getMonitoringInterestTriggers,
  getMonitoringInterests,
  getObservationData,
  getServices,
} from '../utils/api';
import {
  ObsPointData,
  MonInterestData,
  MonInterestDefData,
  MonInterestTriggerData,
  ObsData,
} from '../utils/types';
import {
  haverSine,
  arrayToObject,
  hoursBetweenTimestamps,
  isInside,
  sliceArrayAtValue,
  arrIncludesAny,
} from '../utils/helpers';
import ObservationPoint from './ObservationPoint';
import Loading from './Loading';
import { StateContext } from '../components/State';
import ControlPanel from './ControlPanel';

const getLakes = async () => {
  const data = await import('../data/lakes.json');
  return data;
};

const defaultCenter: any = [65.449704, 26.839269];
const defaultZoom = 6;

const SeurantaMap: React.FC<any> = () => {
  const map = useMap();
  const mapEvents = useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      updateSearchParams({
        lat: center.lat,
        lon: center.lng,
        zoom: map.getZoom(),
      });
    },
  });

  const {
    loading,
    setLoading,
    controlUiEnabled,
    selectedDate,
    viewParams,
    extraParams,
    updateSearchParams,
  }: any = useContext(StateContext);

  const [obsPointItems, setObsPointItems] = useState<ObsPointItemData[]>([]);
  const [obs, setObs] = useState<any>(null);
  const [lakes, setLakes] = useState<any>(null);
  const [lakesLayer, setLakesLayer] = useState<any>(null);

  const obsPoints = useQuery(
    ['observationPoints'],
    () => getObservationPoints(),
    {
      enabled: true,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );

  const monInterestDefs = useQuery(
    ['monitoringInterestDefs'],
    () => getMonitoringInterestDefs(),
    {
      enabled: true,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );

  const monInterests = useQuery(
    ['monitoringInterests'],
    () => getMonitoringInterests(),
    {
      enabled: true,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );

  const monInterestTriggers = useQuery(
    ['monitoringInterestTriggers'],
    () => getMonitoringInterestTriggers(),
    {
      enabled: true,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );

  const services = useQuery(['getServices'], () => getServices(), {
    enabled: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (map && viewParams) {
      if (
        viewParams.lat == null ||
        viewParams.lon == null ||
        viewParams.lat === '' ||
        viewParams.lon === ''
      ) {
        navigator.geolocation.getCurrentPosition((pos) => {
          map.setView([pos.coords.latitude, pos.coords.longitude]);

          if (viewParams.zoom == null) {
            map.setZoom(12);
            return;
          }
        });
        map.setView(defaultCenter, defaultZoom);
      } else {
        map.setView([viewParams.lat, viewParams.lon]);
      }

      if (viewParams.zoom == null || viewParams.zoom === '') {
        map.setZoom(defaultZoom);
      } else {
        map.setZoom(viewParams.zoom);
      }

      getLakes().then((component: any) => {
        setLakes(component);
      });
    }
  }, [map, viewParams]);

  useEffect(() => {
    if (
      obsPoints.data != null &&
      obs &&
      monInterestDefs.data != null &&
      monInterests.data != null &&
      monInterestTriggers.data != null &&
      services.data != null &&
      lakes
    ) {
      const dateLimit = selectedDate.valueOf();

      const obsFiltered = sliceArrayAtValue(obs, selectedDate, 'date');
      const obsPointsFiltered = sliceArrayAtValue(
        obsPoints.data,
        dateLimit,
        'date',
      );
      const monInterestDefsFiltered = sliceArrayAtValue(
        monInterestDefs.data,
        dateLimit,
        'date',
      );
      const monInterestsFiltered = sliceArrayAtValue(
        monInterests.data,
        dateLimit,
        'date',
      );
      const monInterestTriggersFiltered = sliceArrayAtValue(
        monInterestTriggers.data,
        dateLimit,
        'date',
      );

      const items: any = [];

      const points = arrayToObject(obsPointsFiltered.concat(obsFiltered), 'id');

      const defs = arrayToObject(monInterestDefsFiltered, 'id');

      monInterestsFiltered.forEach((interest) => {
        const itemData: any = {};
        itemData.id = interest.id;
        itemData.radius = interest.radius;

        const def = defs[interest.monInterestDefId];

        if (def) {
          itemData.hashtags = def.hashtags;
          itemData.Tv = def.Tv;
          itemData.Ts = def.Ts;
          itemData.Tr = def.Tr;
          itemData.Sv = def.Sv;
          itemData.Ss = def.Ss;
          itemData.Sr = def.Sr;
          itemData.kSv = def.kSv;
          itemData.kSs = def.kSs;
          itemData.kSr = def.kSr;
          itemData.Sinf = def.Sinf;
          itemData.dSv = def.dSv;
          itemData.Somin = def.Somin;

          itemData.trigger = null;

          monInterestTriggersFiltered.forEach((trig) => {
            if (trig.monInterestId === interest.id) {
              if (itemData.trigger && trig.date < itemData.trigger) {
                return;
              }
              if (trig.obsId && points[trig.obsId]) {
                trig.date == points[trig.obsId].date;
              }
              itemData.trigger = trig;
            }
          });

          if (itemData.trigger != null) {
            itemData.hashtags = itemData.hashtags.concat(
              itemData.trigger.hashtags,
            );
          }

          if (itemData.trigger && itemData.trigger.Spmin != null) {
            itemData.Spmin = itemData.trigger.Spmin;
          } else {
            itemData.Spmin = def.Spmin;
          }

          if (itemData.trigger && itemData.trigger.Spmax != null) {
            itemData.Spmax = itemData.trigger.Spmax;
          } else {
            itemData.Spmax = def.Spmax;
          }

          const firstObs = points[interest.obsId];

          let firstObsId = null;

          if (firstObs) {
            itemData.t0 = firstObs.date;
            itemData.lat = firstObs.lat;
            itemData.long = firstObs.long;

            itemData.hashtags = itemData.hashtags.concat(firstObs.hashtags);
          } else {
            itemData.t0 = interest.date;
            itemData.lat = interest.lat;
            itemData.long = interest.long;
          }

          itemData.created = itemData.t0;
          if (
            itemData.trigger &&
            itemData.trigger.obsId &&
            points[itemData.trigger.obsId]
          ) {
            itemData.t0 = points[itemData.trigger.obsId].date;
          }

          for (let i = 0; i < lakes.features.length; i++) {
            const lake = lakes.features[i];
            const coords = lake.geometry.coordinates;
            for (let j = 0; j < coords.length; j++) {
              if (isInside([itemData.lat, itemData.long], coords[j])) {
                itemData.lake = lake;
                itemData.lakeName = lake.properties.Nimi;
                break;
              }
            }
          }

          const obDates: any[] = [dateLimit];

          itemData.serviceId = interest.serviceId;

          itemData.hashtags = itemData.hashtags.concat(interest.hashtags);

          const serviceId =
            itemData.trigger && itemData.trigger.serviceId != null
              ? itemData.trigger.serviceId
              : interest.serviceId;

          if (serviceId != null && serviceId) {
            for (let i = 0; i < obsFiltered.length; i++) {
              const ob = obsFiltered[i];
              if (itemData.t0 < ob.date) {
                if (ob.serviceId === serviceId && ob.id !== firstObsId) {
                  if (
                    haverSine(ob.lat, ob.long, itemData.lat, itemData.long) <=
                    itemData.radius
                  ) {
                    if (
                      !itemData.lake ||
                      (itemData.lake &&
                        isInside(
                          [itemData.lat, itemData.long],
                          itemData.lake.geometry.coordinates[0],
                        ))
                    ) {
                      obDates.unshift(ob.date);

                      itemData.hashtags = itemData.hashtags.concat(ob.hashtags);
                    }
                  }
                }
              } else {
                break;
              }
            }
          }

          itemData.lastObDate =
            obDates.length > 1 ? obDates[obDates.length - 2] : null;

          itemData.count = obDates.length - 1;

          let lastDate = itemData.t0;
          let phase = '';
          let hoursElapsed = 0;

          if (itemData.trigger && itemData.trigger.startPhase) {
            switch (itemData.trigger.startPhase) {
              case 'similarity':
                hoursElapsed = itemData.Tv * 24;
                break;
              case 'reobservation':
                hoursElapsed = (itemData.Tv + itemData.Ts) * 24;
                break;
              case 'indefinite':
                hoursElapsed = (itemData.Tv + itemData.Ts + itemData.Tr) * 24;
                break;
              default:
                hoursElapsed = 0;
            }
          }

          obDates.forEach((date) => {
            if (date >= itemData.t0) {
              const hours = hoursBetweenTimestamps(date, lastDate);
              let totalHours = hours + hoursElapsed;

              if (totalHours < itemData.Tv * 24) {
                if (
                  (itemData.trigger &&
                    itemData.trigger.phaseSkips.includes('validation')) ||
                  date === dateLimit
                ) {
                  hoursElapsed = totalHours;
                  phase = 'validation';
                } else {
                  hoursElapsed = 0;
                  phase = 'validation';
                }
              } else if (totalHours < (itemData.Tv + itemData.Ts) * 24) {
                if (
                  (itemData.trigger &&
                    itemData.trigger.phaseSkips.includes('similarity')) ||
                  date === dateLimit
                ) {
                  hoursElapsed = totalHours;
                  phase = 'similarity';
                } else {
                  hoursElapsed = 0;
                  phase = 'validation';
                }
              } else if (
                totalHours <
                (itemData.Tv + itemData.Ts + itemData.Tr) * 24
              ) {
                if (
                  (itemData.trigger &&
                    itemData.trigger.phaseSkips.includes('reobservation')) ||
                  date === dateLimit
                ) {
                  hoursElapsed = totalHours;
                  phase = 'reobservation';
                } else {
                  hoursElapsed = 0;
                  phase = 'validation';
                }
              } else {
                if (
                  (itemData.trigger &&
                    itemData.trigger.phaseSkips.includes('indefinite')) ||
                  date === dateLimit
                ) {
                  hoursElapsed = totalHours;
                  phase = 'indefinite';
                } else {
                  hoursElapsed = 0;
                  phase = 'validation';
                }
              }
              lastDate = date;
            }
          });

          let s = 0;

          if (phase === 'validation') {
            const hours = hoursElapsed;
            const inc = itemData.kSv != null ? (itemData.kSv * hours) / 24 : 0;
            s = itemData.Sv + inc;
          } else if (phase === 'similarity') {
            const hours = hoursElapsed - itemData.Tv;
            const inc = itemData.kSs != null ? (itemData.kSs * hours) / 24 : 0;
            s = itemData.Ss + inc;
          } else if (phase === 'reobservation') {
            const hours =
              hoursElapsed - (itemData.Tv + itemData.Ts + itemData.Tr);
            const inc = itemData.kSr != null ? (itemData.kSr * hours) / 24 : 0;
            s = itemData.Sr + inc;
          } else if (itemData.Sinf) {
            s = itemData.Sinf;
          }

          if (itemData.trigger && itemData.trigger.Sd) {
            const hours = hoursBetweenTimestamps(lastDate, itemData.t0);
            if (!itemData.trigger.Td || hours < itemData.trigger.Td * 24) {
              const inc = itemData.trigger.kSd
                ? (itemData.trigger.kSd * hours) / 24
                : 0;
              const val = itemData.trigger.Sd + inc;
              s += itemData.trigger.Somin
                ? Math.max(val, itemData.trigger.Somin)
                : val;
            }
          }

          itemData.s = s;
          itemData.phase = phase;

          itemData.hashtags = _.uniq(itemData.hashtags);

          const service = services.data.find(
            (s) => s.service_code === itemData.serviceId,
          );

          if (service) {
            itemData.serviceKeywords = service.keywords;
            itemData.serviceDescription = service.description;
            itemData.serviceName = service.service_name;
          }

          // If either keyword or hashtag matches, add to results. Or, if no keywords or hashtags are defined, add to results.
          itemData.serviceKeywords = itemData.serviceKeywords.map((element) => {
            return element.toLowerCase();
          });

          itemData.hashtags = itemData.hashtags.map((element) => {
            return element.toLowerCase();
          });

          let containsHashtags = false;
          let containsKeywords = false;

          if (extraParams.hashtags.length > 0) {
            if (arrIncludesAny(itemData.hashtags, extraParams.hashtags)) {
              containsHashtags = true;
            }
          }

          if (extraParams.keywords.length > 0) {
            if (
              arrIncludesAny(itemData.serviceKeywords, extraParams.keywords)
            ) {
              containsKeywords = true;
            }
          }

          if (containsKeywords || containsHashtags) {
            items.push(itemData);
          } else if (
            extraParams.keywords.length === 0 &&
            extraParams.hashtags.length === 0
          ) {
            items.push(itemData);
          }
        }
      });
      setLoading(false);
      setObsPointItems(items);
    }
  }, [
    obsPoints.data,
    obs,
    monInterestDefs.data,
    monInterests.data,
    monInterestTriggers.data,
    services.data,
    lakes,
    selectedDate,
  ]);

  useEffect(() => {
    if (monInterestTriggers.data != null && monInterests.data != null) {
      let items: ObsData[] = [];
      const services: string[] = [];
      monInterestTriggers.data.forEach((trig) => {
        const serv = trig.serviceId;
        if (!services.includes(serv) && serv !== undefined) {
          services.push(serv);
        }
      });
      monInterests.data.forEach((interest) => {
        const serv = interest.serviceId;
        if (!services.includes(serv) && serv !== undefined) {
          services.push(serv);
        }
      });
      Promise.all(
        services.map((item) => {
          return getObservationData(item);
        }),
      ).then((data) => {
        data.forEach((el) => {
          items = items.concat(el);
        });
        items.sort((a: any, b: any) => {
          return b.date - a.date;
        });
        setObs(items);
      });
    }
  }, [monInterestTriggers.data, monInterests.data]);

  // const lakeLayer = vectorGrid.protobuf(
  //   'https://gis.avoin.org/geoserver/gwc/service/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=external:lakes&STYLE=polygon&FORMAT=image/png&TILEMATRIXSET=EPSG:3857&TILEMATRIX=EPSG:3857:{z}&TILEROW={x}&TILECOL={y}',
  //   {
  //     tms: true,
  //     attribution:
  //       '&copy; Karttamateriaali <a href="http://www.maanmittauslaitos.fi/avoindata">Maanmittauslaitos</a>',
  //   },
  // );

  useEffect(() => {
    if (map) {
      var mapboxUrl =
        'https://gis.avoin.org/geoserver/gwc/service/tms/1.0.0/external%3Alakes@EPSG%3A900913@png/{z}/{x}/{y}.pbf';

      var mapboxVectorTileOptions = {
        minZoom: 11,
        tms: true,
        // attribution:
        //   '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://www.mapbox.com/about/maps/">MapBox</a>',
        vectorTileLayerStyles: {
          color: 'blue',
          strokeColor: 'blue',
        },
      };

      //@ts-ignore
      var mapboxPbfLayer = L.vectorGrid.protobuf(
        mapboxUrl,
        mapboxVectorTileOptions,
      );

      map.addLayer(mapboxPbfLayer);
    }
  }, [map]);

  useEffect(() => {
    if (lakes && map) {
      const lakesLayer = L.geoJSON(lakes, {
        style: {
          color: 'blue',
          weight: 5,
          opacity: 0.65,
        },
      });

      setLakesLayer(lakesLayer);
      map.addLayer(lakesLayer);
    }
  }, [lakes, map]);

  return (
    <>
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {obsPointItems.map((item) => (
        <ObservationPoint key={item.id} ob={item} />
      ))}
      {/* <LegendContainer>
        <LegendImg />
      </LegendContainer> */}
      {controlUiEnabled && <ControlPanel></ControlPanel>}
      {loading && (
        <LoadingContainer>
          <Loading />
        </LoadingContainer>
      )}
    </>
  );
};

// const LegendContainer: any = styled.div`
//   position: fixed;
//   bottom: 10px;
//   left: 10px;
//   display: flex;
//   flex: 1;
//   z-index: 1000;
// `;

// const LegendImg: any = styled.img.attrs({
//   src: require('../assets/legend.svg'),
// })`
//   background-color: rgb(255, 255, 255, 0.7);
//   padding: 10px;
//   height: 120px;
//   border-radius: 4px;
//   box-shadow: 0 1px 5px rgba(0, 0, 0, 0.65);
// `;

const LoadingContainer: any = styled.div`
  position: fixed;
  bottom: 30px;
  margin-right: auto;
  margin-left: auto;
  left: 0;
  right: 0;
  display: flex;
  flex: 1;
  z-index: 999;
`;

interface ObsPointItemData {
  id: string;
  date: Date;
  lat: number;
  long: number;
  serviceName: string;
  radius: number;
  pVal: number;
}

export default SeurantaMap;
