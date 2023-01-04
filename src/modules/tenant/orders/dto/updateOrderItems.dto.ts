import { Expose, Type } from 'class-transformer';

import { IsString, IsNumber, ValidateNested } from 'class-validator';
import { CroppedPixelArea } from '../model/croppedPixelArea.model';

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

  @ValidateNested({ each: true })
  @Type(() => CroppedPixelArea)
  croppedPixelArea: CroppedPixelArea

  @IsNumber()
  @Expose()
  price: number;
}
