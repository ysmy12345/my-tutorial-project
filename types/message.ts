export interface CustomerMessage {
  id: string;
  appId: string;
  userId: string;
  sessionId: string;
  message: string;
  createdDate: string;
}

export interface MessageResponse {
  items: CustomerMessage[];
  total: number;
}
