import { ReadProductDto } from '../dto';

export interface IReadProductsParams {
  limit?: number;
  page?: number;
  search?: string;
}

export interface IResponseProductData {
  count: number;
  totalPages: number;
  data: ReadProductDto[];
}
