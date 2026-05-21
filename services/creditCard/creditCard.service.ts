import Axios from '@/services/axios.service';
import { CreditCardPayData, CreditCardPayResponse } from '@/services/creditCard/creditCard.dto';



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

    const response = await Axios.post<any, CreditCardPayResponse>(
      'v1/payment/credit',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response;
  },
};
