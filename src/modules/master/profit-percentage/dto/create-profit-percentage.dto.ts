import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProfitPercentageDto {
  @IsNotEmpty()
  @IsNumber()
  photographer_commission: number;

  @IsNotEmpty()
  @IsNumber()
  owner_commission: number;
}
