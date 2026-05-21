import apiClient from './client';

export interface QRCodeResponse {
  status_id: number;
  qr_code: string;
  qr_string: string;
  upi_id: string;
  name: string;
}

export interface GenerateQRCodeData {
  amount?: string;
  note?: string;
}

export const qrCodeService = {
  generateQRCode: async (data: GenerateQRCodeData): Promise<QRCodeResponse> => {
    const formData = new FormData();
    if (data.amount) {
      formData.append('amount', data.amount);
    }
    if (data.note) {
      formData.append('note', data.note);
    }

    const response = await apiClient.post<any, QRCodeResponse>(
      'v1/upi/qr_code_generate',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response;
  },
};
