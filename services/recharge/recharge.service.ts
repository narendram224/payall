import Axios from '@/services/axios.service';
import { ProvidersResponse, RechargeRequest, RechargeResponse, StatusResponse } from '@/services/recharge/recharge.dto';

export const rechargeService = {
  // Perform recharge transaction
  recharge: async (data: RechargeRequest): Promise<RechargeResponse> => {
    const formData = new FormData();
    
    if (data.mobile_number) {
      formData.append('mobile_number', data.mobile_number);
    }
    formData.append('number', data.number);
    formData.append('provider_id', data.provider_id.toString());
    formData.append('amount', data.amount);
    formData.append('client_id', data.client_id);
    
    if (data.optional1) {
      formData.append('optional1', data.optional1);
    }
    if (data.optional2) {
      formData.append('optional2', data.optional2);
    }
    if (data.optional3) {
      formData.append('optional3', data.optional3);
    }
    if (data.optional4) {
      formData.append('optional4', data.optional4);
    }
    if (data.reference_id) {
      formData.append('reference_id', data.reference_id);
    }

    const response = await Axios.post<any, RechargeResponse>(
      'v1/payment/recharge',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response;
  },

  // Check transaction status
  getStatus: async (clientId: string): Promise<StatusResponse> => {
    const formData = new FormData();
    formData.append('client_id', clientId);

    const response = await Axios.post<any, StatusResponse>(
      'v1/payment/status',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response;
  },

  // Get providers (operators)
  getProviders: async (): Promise<ProvidersResponse> => {
    const response = await Axios.get<any, ProvidersResponse>('providers');
    return response;
  },
};
