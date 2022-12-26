import { Expose } from 'class-transformer';

import { IsString, IsNumber } from 'class-validator';

export class UpdateOrderItemsDto {
  @IsString()
  @Expose()
  sku: string;

  @IsString()
  @Expose()
  product_name: string;

  @IsString()
  @Expose()
  category: string;

  @IsString()
  @Expose()
  url_cropped: string;

  @IsNumber()
  @Expose()
  price: number;
}
