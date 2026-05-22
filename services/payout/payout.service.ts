import Axios from '@/services/axios.service';
import { Customer, AddCustomerData, ConfirmCustomerData, UpiTransferData, BankTransferData, PayoutResponse, Beneficiary } from '@/services/payout/payout.dto';

export const payoutService = {
  getCustomer: async (mobile: string): Promise<Customer> => {
    const formData = new FormData();
    formData.append('mobile_number', mobile);

    const response = await Axios.post<any, Customer>(
      'v1/upi/get-customer',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response;
  },

  addCustomer: async (data: AddCustomerData): Promise<any> => {
    const formData = new FormData();
    formData.append('mobile_number', data.mobile_number);
    formData.append('upi_id', data.upi_id);
    formData.append('name', data.name);

    const response = await Axios.post<any, any>(
      'v1/upi/add-customer',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response;
  },

  confirmCustomer: async (data: ConfirmCustomerData): Promise<any> => {
    const formData = new FormData();
    formData.append('mobile_number', data.mobile_number);
    formData.append('otp', data.otp);

    const response = await Axios.post<any, any>(
      'v1/upi/add-customer-confirm',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response;
  },

  upiTransfer: async (data: UpiTransferData): Promise<PayoutResponse> => {
    const formData = new FormData();
    formData.append('mobile_number', data.mobile_number);
    formData.append('upi_id', data.upi_id);
    formData.append('amount', data.amount);
    formData.append('client_id', data.client_id);
    if (data.optional1) {
      formData.append('optional1', data.optional1);
    }

    const response = await Axios.post<any, PayoutResponse>(
      'v1/payout/upi_transfer',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response;
  },

  bankTransfer: async (data: BankTransferData): Promise<PayoutResponse> => {
    const formData = new FormData();
    formData.append('mobile_number', data.mobile_number);
    formData.append('account_number', data.account_number);
    formData.append('ifsc', data.ifsc);
    formData.append('name', data.name);
    formData.append('amount', data.amount);
    formData.append('client_id', data.client_id);
    if (data.optional1) {
      formData.append('optional1', data.optional1);
    }

    const response = await Axios.post<any, PayoutResponse>(
      'v1/payout/bank_transfer',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response;
  },

  getBeneficiaries: async (mobile: string): Promise<Beneficiary[]> => {
    const response = await Axios.get<any, Beneficiary[]>(
      `v1/payout/beneficiary`,
      { params: { mobile_number: mobile } }
    );
    return response;
  },
};
