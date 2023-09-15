export interface IReadWalletsParams {
  limit?: number;
  page?: number;
  search?: string;
  from?: string;
  to?: string;
}

export interface IResponseWalletsData {
  count: number;
  totalPages: number;
  data: any[];
}
