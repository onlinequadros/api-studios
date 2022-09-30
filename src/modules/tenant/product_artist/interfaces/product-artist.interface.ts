import { ReadProductArtistDto } from '../dtos';

export interface IReadProductsArtistParams {
  limit?: number;
  page?: number;
  search?: string;
}

export interface IResponseProductArtisticData {
  count: number;
  totalPages: number;
  data: ReadProductArtistDto[];
}
