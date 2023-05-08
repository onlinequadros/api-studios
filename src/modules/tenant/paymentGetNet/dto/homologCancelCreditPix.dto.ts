import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class getNetHomologCancelCreditPixDTO {
  @IsNumber()
  @IsNotEmpty()
  cancel_amount: number;

  @IsString()
  @IsNotEmpty()
  payment_id: string;
}
