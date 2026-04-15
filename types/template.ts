export interface ServerDescription {
  cpuCoreNo: number;
  ram: string;
  bandwidth: string;
  hardDisk: string;
  hardDiskType: string;
  details: string[];
}

export interface ServerTemplate {
  id: string;
  name: string;
  setupFee: number;
  hourlyFee: number;
  licenseCharge?: number;
  description: ServerDescription;
}
