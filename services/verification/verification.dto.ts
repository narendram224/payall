export interface VerificationResponse<T> {
  status_id: number;
  data: T;
  message: string;
}

export interface AadhaarData {
  name: string;
  dob: string;
  gender: string;
  address: string;
  state: string;
  photo?: string;
}

export interface PanData {
  name: string;
  status: string;
  type: string;
}

export interface UpiData {
  name: string;
  upi_id: string;
  status: string;
}

export interface BankData {
  name: string;
  account_number: string;
  ifsc: string;
  bank: string;
  status: string;
}

export interface GstData {
  legal_name: string;
  state: string;
  registration_date: string;
  status: string;
}

export interface IfscData {
  bank: string;
  branch: string;
  address: string;
  city: string;
  state: string;
  contact: string;
}

export interface ChallanData {
  challan_number: string;
  state: string;
  amount: string;
  status: string;
  name?: string;
}

export interface AadhaarOtpData {
  ref_id: string;
  message: string;
}

export interface VerifyBankAccountData {
  account_number: string;
  ifsc: string;
}

export interface VerifyChallanData {
  challan_number: string;
  state: string;
}