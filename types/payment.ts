export interface PaymentMethod {
  id: string;
  type: string;
  defaultMethod: boolean;
  card: {
    type: string;
    maskedCardNo: string;
    expMonth: string;
    expYear: string;
    walletType: string | null;
  };
}

export interface PaymentMethodResponse {
  items: PaymentMethod[];
  total: number;
}
