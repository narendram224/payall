import Axios from '@/services/axios.service';
import { VerificationResponse, AadhaarOtpData, AadhaarData, PanData, UpiData, BankData, GstData, IfscData, ChallanData, VerifyBankAccountData, VerifyChallanData } from '@/services/verification/verification.dto';


export const verificationService = {
  sendAadhaarOtp: async (
    aadhaar: string
  ): Promise<VerificationResponse<AadhaarOtpData>> => {
    const formData = new FormData();
    formData.append('aadhaar_number', aadhaar);

    const response = await Axios.post<
      any,
      VerificationResponse<AadhaarOtpData>
    >('v1/verify/aadhaar/otp', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response;
  },

  verifyAadhaarOtp: async (data: {
    aadhaar_number: string;
    otp: string;
    ref_id: string;
  }): Promise<VerificationResponse<AadhaarData>> => {
    const formData = new FormData();
    formData.append('aadhaar_number', data.aadhaar_number);
    formData.append('otp', data.otp);
    formData.append('ref_id', data.ref_id);

    const response = await Axios.post<
      any,
      VerificationResponse<AadhaarData>
    >('v1/verify/aadhaar/otp/verify', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response;
  },

  verifyPan: async (pan: string): Promise<VerificationResponse<PanData>> => {
    const formData = new FormData();
    formData.append('pan_number', pan);

    const response = await Axios.post<any, VerificationResponse<PanData>>(
      'v1/verify/pan',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response;
  },

  verifyUpi: async (upi: string): Promise<VerificationResponse<UpiData>> => {
    const formData = new FormData();
    formData.append('upi_id', upi);

    const response = await Axios.post<any, VerificationResponse<UpiData>>(
      'v1/verify/upi',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response;
  },

  verifyBankAccount: async (
    data: VerifyBankAccountData
  ): Promise<VerificationResponse<BankData>> => {
    const formData = new FormData();
    formData.append('account_number', data.account_number);
    formData.append('ifsc', data.ifsc);

    const response = await Axios.post<
      any,
      VerificationResponse<BankData>
    >('v1/verify/bank_account', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response;
  },

  verifyGst: async (gst: string): Promise<VerificationResponse<GstData>> => {
    const formData = new FormData();
    formData.append('gst_number', gst);

    const response = await Axios.post<any, VerificationResponse<GstData>>(
      'v1/verify/gst',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response;
  },

  verifyChallan: async (
    data: VerifyChallanData
  ): Promise<VerificationResponse<ChallanData>> => {
    const formData = new FormData();
    formData.append('challan_number', data.challan_number);
    formData.append('state', data.state);

    const response = await Axios.post<
      any,
      VerificationResponse<ChallanData>
    >('v1/verify/chalan', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response;
  },

  verifyIfsc: async (ifsc: string): Promise<VerificationResponse<IfscData>> => {
    const formData = new FormData();
    formData.append('ifsc_code', ifsc);

    const response = await Axios.post<
      any,
      VerificationResponse<IfscData>
    >('v1/verify/ifsc', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response;
  },
};
