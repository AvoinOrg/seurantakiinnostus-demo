export interface ObsPointData {
  id: string;
  date: number;
  lat: number;
  long: number;
  serviceName: string;
  radius?: number;
  Tv?: number;
  Ts?: number;
  Tr?: number;
  Sv?: number;
  Ss?: number;
  Sr?: number;
  kSv?: number;
  kSs?: number;
  kSr?: number;
  Sinf?: number;
  Somin?: number;
  Spmin?: number;
  Spmax?: number;
  dSv?: number;
  serviceId?: string;
  Smin?: number;
  Smax?: number;
  Td?: number;
  Sd?: number;
  kSd?: number;
  hashtags: string[];
}

export interface MonInterestData {
  id: string;
  date: number;
  obsId: string;
  monInterestDefId: string;
  serviceId: string;
  lat: number;
  long: number;
  radius: number;
  hashtags: string[];
}

export interface MonInterestDefData {
  id: string;
  date: number;
  lat: number;
  long: number;
  Tv: number;
  Ts: number;
  Tr: number;
  Sv: number;
  Ss: number;
  Sr: number;
  kSv: number;
  kSs: number;
  kSr: number;
  Sinf: number;
  Somin: number;
  Spmin: number;
  Spmax: number;
  dSv: number;
  hashtags: string[];
}

export interface MonInterestTriggerData {
  id: string;
  date: number;
  monInterestId: string;
  obsId: string;
  serviceId: string;
  lat: number;
  long: number;
  startPhase: number;
  phaseSkips: number;
  Smin: number;
  Smax: number;
  Td: number;
  Sd: number;
  kSd: number;
  hashtags: string[];
}

export interface ObsData {
  id: string;
  serviceId: string;
  date: number;
  lat: number;
  long: number;
  hashtags: string[];
}

export interface ServiceData {
  service_code: string;
  service_name: string;
  description: string;
  keywords: string[];
}

export interface ObsRes {
  id: string;
  items: ObsData[];
}
