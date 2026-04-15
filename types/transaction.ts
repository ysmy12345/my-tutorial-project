import { formatBalance, formatCurrency, formatDateTime } from "../utils/format";

export interface PaymentResponse {
  items: PaymentItem[];
  total: number;
}

export interface PaymentItem {
  id: string;
  paymentRef: string;
  purpose: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: string;
  receiptEmail: string | null;
  metaData: string | TopUpMetaData;
  createdDate: string;
  clientSecret: string | null;
}

export interface PaymentMethod {
  id: string;
  type: string;
  defaultMethod: boolean;
  card: CardDetails;
}

export interface CardDetails {
  type: string;
  maskedCardNo: string;
  expMonth: string;
  expYear: string;
  walletType: string | null;
}

export interface TopUpMetaData {
  points: number;
  topUpTransactionId: string;
  costBreakdown: CostBreakdown;
}

export interface CostBreakdown {
  subTotal: number;
  tax: number;
  total: number;
  currency: string;
  taxPercent: number;
}

export interface TransactionDisplayInfo {
  title: string;
  description: string;
  paymentType: string;
  createdDate: string;
  price: string;
  topUpMetadata: TopUpMetaData | null;
}

export enum PaymentType {
  Card = "Card",
  Alipay = "Alipay",
  GooglePay = "Google Pay",
  ApplePay = "Apple Pay",
}

export const getTransactionDisplayInfo = (
  transaction: PaymentItem,
  t: any
): TransactionDisplayInfo => {
  if (transaction.purpose === "PURCHASE_CREDIT") {
    let topUpMetaData: TopUpMetaData | null = null;
    try {
      const metaDataString =
        typeof transaction.metaData === "string"
          ? transaction.metaData
          : JSON.stringify(transaction.metaData);

      topUpMetaData = JSON.parse(metaDataString);
    } catch (e) {
      console.error("Failed to parse transaction metaData", e);
    }

    let paymentType: PaymentType | string;
    if (transaction.paymentMethod?.type === "card") {
      const walletType = transaction.paymentMethod.card?.walletType; // e.g., 'apple_pay', 'google_pay', etc.
      if (walletType === "apple_pay") {
        paymentType = PaymentType.ApplePay;
      } else if (walletType === "google_pay") {
        paymentType = PaymentType.GooglePay;
      } else {
        paymentType = PaymentType.Card;
      }
    } else if (transaction.paymentMethod?.type === "alipay") {
      paymentType = PaymentType.Alipay;
    } else if (transaction.paymentMethod?.type === "google_pay") {
      paymentType = PaymentType.GooglePay;
    } else if (transaction.paymentMethod?.type === "apple_pay") {
      paymentType = PaymentType.ApplePay;
    } else {
      paymentType = "Other";
    }

    return {
      title: t('accountTopup'),
      description: topUpMetaData?.points
        ? t('topUpValue', { point: formatBalance(topUpMetaData?.points), pointUnit: t('pointUnit') })
        : "",
      paymentType,
      createdDate: formatDateTime(transaction.createdDate ?? ""),
      price: formatCurrency(
        transaction.amount ?? 0,
        transaction.currency ?? "SGD",
        2
      ),
      topUpMetadata: topUpMetaData,
    };
  }

  // Default return for unknown purposes
  return {
    title: transaction.purpose,
    description: "",
    paymentType: "",
    createdDate: formatDateTime(transaction.createdDate ?? ""),
    price: formatCurrency(
      transaction.amount ?? 0,
      transaction.currency ?? "SGD",
      2
    ),
    topUpMetadata: {
      points: 0,
      topUpTransactionId: "",
      costBreakdown: {
        subTotal: 0,
        tax: 0,
        total: 0,
        currency: "SGD",
        taxPercent: 0,
      },
    },
  };
};
