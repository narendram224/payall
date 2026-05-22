import Axios from "@/services/axios.service";

export interface BBPSCategory {
  id: number;
  name: string;
  slug: string;
  icon: string;
  active: number;
}

export interface BBPSInputParam {
  paramName: string;
  dataType: string;
  optional: boolean;
  minLength: number;
  maxLength: number;
}

export interface BBPSBiller {
  id: number;
  billerID: string;
  billerName: string;
  billerAlias: string;
  billerCategoryCode: string;
  billerAcceptsAdhoc: boolean;
  billerPaymentModes: string[];
  paymentAmountExactness: string;
  billerInputParams: BBPSInputParam[];
}

export interface BillFetchRequest {
  billerID: string;
  customerParams: Record<string, string>;
  amount?: string;
  clientId: string;
}

export interface BillFetchResponse {
  status_id: number;
  data: {
    billAmount: string;
    dueDate: string;
    billDate: string;
    billerResponse: Record<string, string>;
    customerName?: string;
  };
  message: string;
}

export interface BillPayRequest {
  billerID: string;
  customerParams: Record<string, string>;
  amount: string;
  clientId: string;
  paymentMode: string;
}

export interface BillPayResponse {
  status_id: number;
  order_id: string;
  amount: string;
  utr: string;
  message: string;
  balance?: string;
}

export const bbpsService = {
  getCategories: async (): Promise<BBPSCategory[]> => {
    const response = await Axios.get<any, BBPSCategory[]>('bbps/category');
    return response;
  },

  getCategoryBySlug: async (slug: string): Promise<BBPSBiller[]> => {
    const response = await Axios.get<any, BBPSBiller[]>(`bbps/category/${slug}`);
    return response;
  },

  getBiller: async (billerId: string): Promise<BBPSBiller> => {
    const response = await Axios.get<any, BBPSBiller>(`bbps/biller/${billerId}`);
    return response;
  },

  fetchBill: async (data: BillFetchRequest): Promise<BillFetchResponse> => {
    const formData = new FormData();
    formData.append('billerID', data.billerID);
    formData.append('clientId', data.clientId);
    if (data.amount) {
      formData.append('amount', data.amount);
    }
    Object.entries(data.customerParams).forEach(([key, value]) => {
      formData.append(`customerParams[${key}]`, value);
    });

    const response = await Axios.post<any, BillFetchResponse>(
      'bbps/fetch',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response;
  },

  payBill: async (data: BillPayRequest): Promise<BillPayResponse> => {
    const formData = new FormData();
    formData.append('billerID', data.billerID);
    formData.append('amount', data.amount);
    formData.append('clientId', data.clientId);
    formData.append('paymentMode', data.paymentMode);
    Object.entries(data.customerParams).forEach(([key, value]) => {
      formData.append(`customerParams[${key}]`, value);
    });

    const response = await Axios.post<any, BillPayResponse>(
      'bbps/payment',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response;
  },
};
