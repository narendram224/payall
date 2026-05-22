export interface Customer {
  id: number;
  name: string;
  mobile_number: string;
  upi_id: string;
  status: string;
}

export interface Beneficiary {
  id: number;
  name: string;
  account_number: string;
  ifsc: string;
  bank_name: string;
  mobile_number: string;
}

export interface PayoutResponse {
  status_id: number;
  order_id: string;
  amount: string;
  utr?: string;
  message: string;
  balance?: string;
}

export interface AddCustomerData {
  mobile_number: string;
  upi_id: string;
  name: string;
}

export interface ConfirmCustomerData {
  mobile_number: string;
  otp: string;
}

export interface UpiTransferData {
  mobile_number: string;
  upi_id: string;
  amount: string;
  client_id: string;
  optional1?: string;
}

export interface BankTransferData {
  mobile_number: string;
  account_number: string;
  ifsc: string;
  name: string;
  amount: string;
  client_id: string;
  optional1?: string;
}