export interface PointItem {
  id: string;
  points: number;
  price: number;
  currency: string;
  enabled: boolean;
}

export interface PointsResponse {
  items: PointItem[];
  total: number;
}

export interface CheckoutData {
  subTotal: number;
  tax: number;
  total: number;
  currency: string;
  taxPercent: number;
}
