interface VpsRegion {
  id: string;
  name: string;
  enabled: boolean;
}

interface VpsRegionListResponse {
  items: VpsRegion[];
  total: number;
}
