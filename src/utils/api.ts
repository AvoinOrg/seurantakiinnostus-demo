import axios from 'axios';

import {
  ObsPointData,
  MonInterestData,
  MonInterestDefData,
  MonInterestTriggerData,
  ObsData,
  ObsRes,
} from './types';

const ENTRYPOINT =
  'https://rajapinnat.ymparisto.fi/api/kansalaishavainnot/1.0/requests.json';

export const getObservationPoints = async (): Promise<ObsPointData[]> => {
  const { data } = await axios.get(ENTRYPOINT, {
    params: {
      status: 'valid, open',
      service_code: 'staticobservationsite_service_code_201907020935326',
      extension: 'true',
    },
  });

  const items: ObsPointData[] = data.map((item: any) => ({
    id: item.service_request_id,
    date: Date.parse(item.requested_datetime),
    serviceName: item.service_name,
    lat: Number(item.lat.replace(/,/, '.')),
    long: Number(item.long.replace(/,/, '.')),
  }));

  return items;
};

export const getMonitoringInterests = async (): Promise<MonInterestData[]> => {
  const { data } = await axios.get(ENTRYPOINT, {
    params: {
      service_code: 'monint_basicsite_service_code_201911180952014',
      extension: 'true',
    },
  });

  const items: MonInterestData[] = data.map((item: any) => ({
    id: item.service_request_id,
    date: Date.parse(item.requested_datetime),
    obsId: item.attributes.string_201911180958422,
    monInterestDefId: item.attributes.string_201911180959219,
    serviceId: item.attributes.string_201911180955377,
    lat: Number(item.lat.replace(/,/, '.')),
    long: Number(item.long.replace(/,/, '.')),
    radius: item.attributes.number_201911180956460
      ? Number(item.attributes.number_201911180956460)
      : 0,
  }));

  return items;
};

export const getMonitoringInterestDefs = async (): Promise<
  MonInterestDefData[]
> => {
  const { data } = await axios.get(ENTRYPOINT, {
    params: {
      service_code: 'monint_smodel_service_code_201912121702022',
      extension: 'true',
    },
  });

  const items: MonInterestDefData[] = data.map((item: any) => ({
    id: item.service_request_id,
    date: Date.parse(item.requested_datetime),
    lat: Number(item.lat.replace(/,/, '.')),
    long: Number(item.long.replace(/,/, '.')),
    Tv: item.attributes.monint_Tv_number_201912121702023
      ? Number(
          item.attributes.monint_Tv_number_201912121702023.replace(/,/, '.'),
        )
      : 1,
    Ts: item.attributes.monint_Ts_number_201912121702030
      ? Number(
          item.attributes.monint_Ts_number_201912121702030.replace(/,/, '.'),
        )
      : 0,
    Tr: item.attributes.monint_Tr_number_201912121702034
      ? Number(
          item.attributes.monint_Tr_number_201912121702034.replace(/,/, '.'),
        )
      : 0,
    Sv: item.attributes.monint_Sv_number_201912121702028
      ? Number(
          item.attributes.monint_Sv_number_201912121702028.replace(/,/, '.'),
        )
      : 100,
    Ss: item.attributes.monint_Ss_number_201912121702032
      ? Number(
          item.attributes.monint_Ss_number_201912121702032.replace(/,/, '.'),
        )
      : 0,
    Sr: item.attributes.monint_Sr_number_201912121702035
      ? Number(
          item.attributes.monint_Sr_number_201912121702035.replace(/,/, '.'),
        )
      : 0,
    kSv: item.attributes.monint_kSv_number_201912121702029
      ? Number(
          item.attributes.monint_kSv_number_201912121702029.replace(/,/, '.'),
        )
      : 0,
    kSs: item.attributes.monint_kSs_number_201912121702033
      ? Number(
          item.attributes.monint_kSs_number_201912121702033.replace(/,/, '.'),
        )
      : 0,
    kSr: item.attributes.monint_kSr_number_201912121702037
      ? Number(
          item.attributes.monint_kSr_number_201912121702037.replace(/,/, '.'),
        )
      : 0,
    Sinf: item.attributes.monint_Sinf_number_201912121702038
      ? Number(
          item.attributes.monint_Sinf_number_201912121702038.replace(/,/, '.'),
        )
      : 0,
    dSv: item.attributes.monint_dSv_number_201912121702027
      ? Number(
          item.attributes.monint_dSv_number_201912121702027.replace(/,/, '.'),
        )
      : 0,
    Spmin: item.attributes.monint_Spmin_number_201912121753281
      ? Number(
          item.attributes.monint_Spmin_number_201912121753281.replace(/,/, '.'),
        )
      : 0,
    Spmax: item.attributes.monint_Spmax_number_201912121756330
      ? Number(
          item.attributes.monint_Spmax_number_201912121756330.replace(/,/, '.'),
        )
      : 0,
    Somin: item.attributes.monint_Somin_number_201912121743338
      ? Number(
          item.attributes.monint_Somin_number_201912121743338.replace(/,/, '.'),
        )
      : 0,
  }));

  return items;
};

export const getMonitoringInterestTriggers = async (): Promise<
  MonInterestTriggerData[]
> => {
  const { data } = await axios.get(ENTRYPOINT, {
    params: {
      service_code: 'monint_startevent_service_code_201912031300509',
      extension: 'true',
    },
  });

  const items: MonInterestTriggerData[] = data.map((item: any) => ({
    id: item.service_request_id,
    date: Date.parse(item.requested_datetime),
    monInterestId:
      item.attributes.monint_startevent_siteofinterest_string_201912031300511,
    obsId: item.attributes.monint_startevent_initeventid_string_201912031300512,
    serviceId:
      item.attributes.monint_startevent_initiatingsc_string_201912031300514,
    startPhase:
      item.attributes
        .monint_startevent_startphase_singlevaluelist_201912031300515 &&
      getPhase(
        item.attributes
          .monint_startevent_startphase_singlevaluelist_201912031300515
          ? item.attributes
              .monint_startevent_startphase_singlevaluelist_201912031300515
          : 'validation',
      ),
    phaseSkips: item.attributes
      .monint_startevent_passphases_multivaluelist_201912031300516
      ? getPhaseSkips(
          Number(
            item.attributes
              .monint_startevent_passphases_multivaluelist_201912031300516,
          ),
        )
      : [],
    lat: Number(item.lat.replace(/,/, '.')),
    lon: Number(item.long.replace(/,/, '.')),
    Smin:
      item.attributes.monint_Smin_number_201912031319308 &&
      Number(
        item.attributes.monint_Smin_number_201912031319308.replace(/,/, '.'),
      ),
    Smax:
      item.attributes.monint_Smax_number_201912031321158 &&
      Number(
        item.attributes.monint_Smax_number_201912031321158.replace(/,/, '.'),
      ),
    Td:
      item.attributes.monint_Td_number_201912031300517 &&
      Number(
        item.attributes.monint_Td_number_201912031300517.replace(/,/, '.'),
      ),
    Sd:
      item.attributes.monint_Sd_number_201912031300519 &&
      Number(
        item.attributes.monint_Sd_number_201912031300519.replace(/,/, '.'),
      ),
    kSd:
      item.attributes.monint_kSd_number_201912031300520 &&
      Number(
        item.attributes.monint_kSd_number_201912031300520.replace(/,/, '.'),
      ),
  }));

  items.sort((a: any, b: any) => {
    return b.date - a.date;
  });

  return items;
};

export const getObservationData = (serviceCode: string): Promise<ObsData[]> => {
  return axios
    .get(ENTRYPOINT, {
      params: {
        service_code: serviceCode,
        extension: 'true',
      },
    })
    .then(({ data }) => {
      const obs = data.map((item: any) => ({
        id: item.service_request_id,
        serviceId: serviceCode,
        date: Date.parse(item.requested_datetime),
        lat: Number(item.lat.replace(/,/, '.')),
        long: Number(item.long.replace(/,/, '.')),
      }));
      return obs;
    })
    .catch((error) => {
      console.log(error);
      return [];
    });
};

export const getPriority = async (apiId: string): Promise<Number | null> => {
  const { data } = await axios.get(ENTRYPOINT, {
    params: {
      service_code: 'api_privileges_general_service_code_en_202206071516241',
      extension: 'true',
    },
  });

  for (const key in data) {
    const item = data[key];
    if (
      item.attributes.api_privileges_general_apiid_number_202206071516219 ===
      apiId
    ) {
      const priority =
        Number(
          item.attributes.api_privileges_general_level_singlevaluelist_202206071516223.replace(
            /,/,
            '.',
          ),
        ) +
        Number(
          item.attributes.api_privileges_general_increment_number_202206071516225.replace(
            /,/,
            '.',
          ),
        );
      return priority;
    }
  }

  return null;
};

const phaseValues = {
  ordered: 32768,
  indefinite: 128,
  reobservation: 8,
  similarity: 2,
  validation: 1,
};

const getPhaseSkips = (val: number): string[] => {
  const phases: string[] = [];

  Object.keys(phaseValues).forEach((key) => {
    if (val >= phaseValues[key]) {
      phases.unshift(key);
      val -= phaseValues[key];

      if (val === 0) {
        return;
      }
    }
  });

  return phases;
};

const getPhase = (val: number): string => {
  let phase = '';
  switch (val) {
    case 1:
      phase = 'validation';
      break;
    case 2:
      phase = 'similarity';
      break;
    case 3:
      phase = 'reobservation';
      break;
    case 4:
      phase = 'indefinite';
      break;
    case 5:
      phase = 'ordered';
      break;
    default:
      phase = 'indefinite';
  }

  return phase;
};
