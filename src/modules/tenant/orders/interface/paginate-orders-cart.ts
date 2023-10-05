export interface IReadOrderCartParams {
  limit?: number;
  page?: number;
  search?: string;
  from?: string;
  to?: string;
}

export interface IResponseOrderCartData {
  count: number;
  totalPages: number;
  data: any[];
}
