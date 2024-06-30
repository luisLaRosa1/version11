export interface IResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface IResponseV2<T> {
  status: number;
  message: string;
  transactionId: number;
  data: T;
}
