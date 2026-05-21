import Axios from '@/services/axios.service';
import { CreateOutletData, Outlet, State, City, District } from '@/services/outlet/outlet.dto';

export const outletService = {
  createOutlet: async (data: CreateOutletData): Promise<Outlet> => {
    const response = await Axios.post<any, Outlet>('outlet/store', data, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response;
  },

  getOutlets: async (mobile: string): Promise<Outlet[]> => {
    const response = await Axios.get<any, Outlet[]>('outlet', {
      params: { mobile_number: mobile },
    });
    return response;
  },

  getStates: async (): Promise<State[]> => {
    const response = await Axios.get<any, State[]>('outlet/state');
    return response;
  },

  getCities: async (stateId: number): Promise<City[]> => {
    const response = await Axios.get<any, City[]>(`outlet/city/${stateId}`);
    return response;
  },

  getDistricts: async (stateId: number): Promise<District[]> => {
    const response = await Axios.get<any, District[]>(
      `outlet/district/${stateId}`
    );
    return response;
  },
};
