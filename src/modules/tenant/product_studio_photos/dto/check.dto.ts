import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CheckObject } from '../models/check.model';

export class CheckImagesDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CheckObject)
  images: CheckObject[];
}
