import Axios from '@/services/axios.service';
import { QRCodeResponse, GenerateQRCodeData } from '@/services/qrCode/qrCode.dto';

export const qrCodeService = {
  generateQRCode: async (data: GenerateQRCodeData): Promise<QRCodeResponse> => {
    const formData = new FormData();
    if (data.amount) {
      formData.append('amount', data.amount);
    }
    if (data.note) {
      formData.append('note', data.note);
    }

    const response = await Axios.post<any, QRCodeResponse>(
      'v1/upi/qr_code_generate',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response;
  },
};
