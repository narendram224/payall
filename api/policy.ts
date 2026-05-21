import apiClient from './client';

export interface PolicyUrlResponse {
  status_id: number;
  url: string;
  message: string;
}

export interface PolicyStatusData {
  order_id: string;
  status: string;
  amount: string;
  message: string;
}

export interface PolicyStatusResponse {
  status_id: number;
  data: PolicyStatusData;
  message: string;
}

export interface InsuranceUrlData {
  service_id: number | string;
  amount: string;
  name: string;
  mobile: string;
  email: string;
  dob?: string;
}

export interface InsuranceStatusData {
  order_id: string;
}

export const policyService = {
  getInsuranceUrl: async (
    data: InsuranceUrlData
  ): Promise<PolicyUrlResponse> => {
    const formData = new FormData();
    formData.append('service_id', String(data.service_id));
    formData.append('amount', data.amount);
    formData.append('name', data.name);
    formData.append('mobile', data.mobile);
    formData.append('email', data.email);
    if (data.dob) {
      formData.append('dob', data.dob);
    }

    const response = await apiClient.post<any, PolicyUrlResponse>(
      'v1/policy/encrypt',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response;
  },

  getInsuranceStatus: async (
    data: InsuranceStatusData
  ): Promise<PolicyStatusResponse> => {
    const formData = new FormData();
    formData.append('order_id', data.order_id);

    const response = await apiClient.post<any, PolicyStatusResponse>(
      'v1/policy/status',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response;
  },
};
