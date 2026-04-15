export interface VpsInstanceDetails {
  cpuCore: number;
  memory: number;
  diskSize: number;
  os: string;
  consoleAccessStatus: string;
  consoleAccessEnabled: boolean;
  consoleAccessEnabling: boolean;
  consoleAccessDisabling: boolean;
  consoleAccessUrl: string;
  consoleAccessPassword: string;
  consoleAccessCode: string;
  rescueModeEnabled: boolean;
  rescueModeEnabling: boolean;
  rescueModeDisabling: boolean;
  password: string;
  vpsUsername: string;
  region: string;
  publicIpV4: string;
  smtp: boolean;
  planId: string;
}

export interface VpsInstance {
  id: string;
  vpsId: string;
  userId: string;
  name: string;
  status: string;
  ableToStop: boolean;
  ableToPowerOff: boolean;
  ableToStart: boolean;
  ableToReboot: boolean;
  ableToTerminate: boolean;
  vpsInstance: VpsInstanceDetails | null;
}

export interface VpsResponse {
  items: VpsInstance[];
  total: number;
}

export interface UpgradeVpsPlan {
  id: string;
  cpuCore: number;
  memory: number;
  disk1Size: number;
  setupPoint: number;
  hourlyPoint: number;
  planOrder: number;
  status: boolean;
  planName: string;
  available: boolean;
  licensePoint?: number;
}

export interface UpgradeVpsPlanResponse {
  total: number;
  items: UpgradeVpsPlan[];
}