import { Expose, Type } from 'class-transformer';

import {
  IsString,
  IsNumber,
  ValidateNested,
  IsOptional,
} from 'class-validator';
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

  @IsNumber()
  @IsOptional()
  @Expose()
  quantity?: number;

  @IsString()
  @IsOptional()
  @Expose()
  image_dimension_frame?: string;

  @IsString()
  @Expose()
  url_cropped: string;

  @ValidateNested({ each: true })
  @Type(() => CroppedPixelArea)
  croppedPixelArea: CroppedPixelArea;

  @IsNumber()
  @Expose()
  price: number;
}
