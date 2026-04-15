export interface OperatingSystem {
  id: string;
  name: string;
  descriptionSlug: string | null;
}

export interface OperatingSystemListResponse {
  items: OperatingSystem[];
  total: number;
}
