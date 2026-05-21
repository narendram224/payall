import Axios from '@/services/axios.service';
import { BBPSCategory, BBPSBiller, BillFetchRequest, BillFetchResponse, BillPayRequest, BillPayResponse } from '@/services/bbps/bbps.dto';



export const bbpsService = {
  getCategories: async (): Promise<BBPSCategory[]> => {
    const response = await Axios.get<any, BBPSCategory[]>('bbps/category');
    return response;
  },

  getCategoryBySlug: async (slug: string): Promise<BBPSBiller[]> => {
    const response = await Axios.get<any, BBPSBiller[]>(`bbps/category/${slug}`);
    return response;
  },

  getBiller: async (billerId: string): Promise<BBPSBiller> => {
    const response = await Axios.get<any, BBPSBiller>(`bbps/biller/${billerId}`);
    return response;
  },

  fetchBill: async (data: BillFetchRequest): Promise<BillFetchResponse> => {
    const formData = new FormData();
    formData.append('billerID', data.billerID);
    formData.append('clientId', data.clientId);
    if (data.amount) {
      formData.append('amount', data.amount);
    }
    Object.entries(data.customerParams).forEach(([key, value]) => {
      formData.append(`customerParams[${key}]`, value);
    });

    const response = await Axios.post<any, BillFetchResponse>(
      'bbps/fetch',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response;
  },

  payBill: async (data: BillPayRequest): Promise<BillPayResponse> => {
    const formData = new FormData();
    formData.append('billerID', data.billerID);
    formData.append('amount', data.amount);
    formData.append('clientId', data.clientId);
    formData.append('paymentMode', data.paymentMode);
    Object.entries(data.customerParams).forEach(([key, value]) => {
      formData.append(`customerParams[${key}]`, value);
    });

    const response = await Axios.post<any, BillPayResponse>(
      'bbps/payment',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response;
  },
};
