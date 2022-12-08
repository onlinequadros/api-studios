import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { MandaeShippingType } from '../types/mandae.type';

export class MandaeDTO {
  @ValidateNested()
  @Type(() => MandaeShippingType)
  items: MandaeShippingType;
}
