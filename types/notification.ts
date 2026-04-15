export interface Notification {
  notificationId: string;
  createdDate: string;
  type: string;
  title: string;
  body: string;
  viewed: boolean;
  mainImageUrl: string | null;
  metadata: any | null;
}

export interface NotificationResponse {
  items: Notification[];
  total: number;
}
