import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PurchasePaymentType {
  @IsNotEmpty()
  @IsString()
  purchaseDescription: String;

  @IsNotEmpty()
  @IsNumber()
  amount: Number;
}
