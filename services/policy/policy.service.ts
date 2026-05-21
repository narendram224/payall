import Axios from '@/services/axios.service';
import { PolicyUrlResponse, PolicyStatusResponse, InsuranceUrlData, InsuranceStatusData } from '@/services/policy/policy.dto';

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

    const response = await Axios.post<any, PolicyUrlResponse>(
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

    const response = await Axios.post<any, PolicyStatusResponse>(
      'v1/policy/status',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response;
  },
};
