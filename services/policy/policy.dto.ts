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