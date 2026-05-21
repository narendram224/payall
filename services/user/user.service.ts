import Axios from '@/services/axios.service';
import { CommissionResponse, UserInfo } from '@/services/user/user.dto';

export const userService = {
  getUser: async () => {
    const response = await Axios.get<UserInfo>('user');
    return response.data;
  },

  getCommission: async () => {
    const response = await Axios.get<CommissionResponse>('report/my-commission');
    return response.data;
  },
};