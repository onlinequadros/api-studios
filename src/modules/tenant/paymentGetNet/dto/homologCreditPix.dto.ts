import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class getNetHomologCreditPixDTO {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  order_id?: string;
  customer_id?: string;
}
