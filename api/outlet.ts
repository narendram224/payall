import apiClient from './client';

export interface Outlet {
  id: number;
  name: string;
  mobile_number: string;
  address: string;
  state: string;
  city: string;
  district: string;
  pincode: string;
  active: number;
}

export interface State {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
}

export interface District {
  id: number;
  name: string;
}

export interface CreateOutletData {
  name: string;
  mobile_number: string;
  address: string;
  state_id: number;
  city_id: number;
  district_id: number;
  pincode: string;
}

export const outletService = {
  createOutlet: async (data: CreateOutletData): Promise<Outlet> => {
    const response = await apiClient.post<any, Outlet>('outlet/store', data, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response;
  },

  getOutlets: async (mobile: string): Promise<Outlet[]> => {
    const response = await apiClient.get<any, Outlet[]>('outlet', {
      params: { mobile_number: mobile },
    });
    return response;
  },

  getStates: async (): Promise<State[]> => {
    const response = await apiClient.get<any, State[]>('outlet/state');
    return response;
  },

  getCities: async (stateId: number): Promise<City[]> => {
    const response = await apiClient.get<any, City[]>(`outlet/city/${stateId}`);
    return response;
  },

  getDistricts: async (stateId: number): Promise<District[]> => {
    const response = await apiClient.get<any, District[]>(
      `outlet/district/${stateId}`
    );
    return response;
  },
};
