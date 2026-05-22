import Axios from '@/services/axios.service';

export interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  balance: string;
  wallet_balance: string;
  avatar?: string;
}

export interface CommissionData {
  total: string;
  today: string;
  week: string;
  month: string;
}

export interface CommissionResponse {
  status_id: number;
  data: CommissionData;
  message: string;
}

export const userService = {
  getUser: async (): Promise<User> => {
    const response = await Axios.get<any, User>('user');
    return response;
  },

  getCommission: async (): Promise<CommissionResponse> => {
    const response = await Axios.get<any, CommissionResponse>('report/my-commission');
    return response;
  },
};
