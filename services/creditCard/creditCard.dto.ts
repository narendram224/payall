export interface CreditCardPayResponse {
  status_id: number;
  order_id: string;
  amount: string;
  utr?: string;
  message: string;
}

export interface CreditCardPayData {
  number: string;
  provider_id: string;
  amount: string;
  client_id: string;
  card_number?: string;
}