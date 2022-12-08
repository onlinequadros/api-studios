import { IsDecimal, IsNotEmpty, IsNumber } from 'class-validator';

export class MandaeShippingType {
  @IsNumber()
  @IsNotEmpty()
  declaredValue: number;
  weight: number;
  height: number;

  @IsNumber()
  @IsNotEmpty()
  width: number;
  length: number;
  quantity: number;
}
