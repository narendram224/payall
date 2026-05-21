export interface UserInfo {
  balance: Balance
  bank_account: BankAccount
  company: Company
  company_name: string
  email: string
  id: number
  image: string
  mobile: string
  name: string
  profile: Profile
  role: Role
  status: number
}

export interface Balance {
  aeps_balance: number
  lien_balance: string
  user_balance: number
}

export interface BankAccount {
  data: Data
  message: string
  status_id: number
}

export interface Data {
  add_fund: number
  api_id: number
  beneficiary_name: string
  mobile_number: string
  payment_link: string
  virtual_account_number: string
  virtual_ifsc: string
  virtual_upi: string
}

export interface Company {
  about_company: string
  address: string
  admin_transfer_min_amount: string
  api_docs: string
  company_name: string
  contact_email: string
  contact_number: string
  contentWidth: string
  facebook: string
  fixSiderbar: string
  frontend_url: string
  gst_number: string
  is_auto_whitelist: string
  is_directapi: string
  is_email: string
  is_location: string
  is_outlet_whitelist: string
  is_whatsapp_banner: string
  layout: string
  logo: string
  pwa: string
  register_table: string
  senderid: string
  site_description: string
  site_description_1: string
  site_description_2: string
  site_name: string
  slogen: string
  tawk: string
  title: string
  twitter: string
  youtube: string
}

export interface Profile {
  address: string
  company: string
  created_at: string
  dob: string
  gst: string
  id: number
  kyc: number
  kyc_number: string
  kyc_type: string
  pan_card: string
  pin_code: string
  profile_picture: string
  status: number
  updated_at: string
  user_id: number
  website: string
}

export interface Role {
  active: number
  created_at: any
  id: number
  role_slug: string
  role_title: string
  updated_at: any
}
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