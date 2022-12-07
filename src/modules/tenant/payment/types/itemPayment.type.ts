import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ItemPaymentType {
  @IsString()
  @IsNotEmpty()
  name: String;

  @IsNumber()
  @IsNotEmpty()
  quantity: Number;
  unit_amount: Number;
}
