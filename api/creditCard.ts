import apiClient from './client';

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

export const creditCardService = {
  payCreditCard: async (
    data: CreditCardPayData
  ): Promise<CreditCardPayResponse> => {
    const formData = new FormData();
    formData.append('number', data.number);
    formData.append('provider_id', data.provider_id);
    formData.append('amount', data.amount);
    formData.append('client_id', data.client_id);
    if (data.card_number) {
      formData.append('card_number', data.card_number);
    }

    const response = await apiClient.post<any, CreditCardPayResponse>(
      'v1/payment/credit',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response;
  },
};
