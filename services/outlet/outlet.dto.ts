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