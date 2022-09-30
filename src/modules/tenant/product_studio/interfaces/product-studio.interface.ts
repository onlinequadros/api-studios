import { ReadProductStudioDto } from '../dtos';

export interface IReadProductsStudioParams {
  limit?: number;
  page?: number;
  search?: string;
}

export interface IResponseProductStudioData {
  count: number;
  totalPages: number;
  data: ReadProductStudioDto[];
}
