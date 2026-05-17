import apiClient from './client';

export interface RechargeRequest {
  mobile_number?: string;
  number: string;
  provider_id: number;
  amount: string;
  client_id: string;
  optional1?: string;
  optional2?: string;
  optional3?: string;
  optional4?: string;
  reference_id?: string;
}

export interface RechargeResponse {
  status_id: number;
  amount: string;
  order_id: string;
  utr: string;
  report_id: number;
  balance: string;
  message: string;
  transaction_date: string;
}

export interface StatusResponse {
  status_id: number;
  data: {
    id: number;
    number: string;
    user_id: number;
    provider_id: number;
    api_id: number;
    status_id: number;
    amount: number;
    profit: number;
    total_balance: number;
    client_id: string;
    order_id: string;
    outlet_id: number;
    created_at: string;
    updated_at: string;
    wallet_id: number;
  };
  message: string;
}

export interface Provider {
  id: number;
  provider_name: string;
  service_id: number;
  description: string | null;
  icon: string;
  icon_class: string;
  active: number;
}

export interface Service {
  id: number;
  service_name: string;
  slug: string;
  description: string;
  icon_class: string;
  icon: string;
  company_id: number;
  active: number;
  wallet_id: number;
  display: number;
}

export interface ProvidersResponse {
  services: Service[];
  providers: Provider[];
}

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

    const response = await apiClient.post<any, RechargeResponse>(
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

    const response = await apiClient.post<any, StatusResponse>(
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
    const response = await apiClient.get<any, ProvidersResponse>('providers');
    return response;
  },
};
