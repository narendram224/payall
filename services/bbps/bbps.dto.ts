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