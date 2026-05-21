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