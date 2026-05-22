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
