import { IsNotEmpty, IsString } from 'class-validator';

export class NumberOrderType {
  @IsString()
  @IsNotEmpty()
  order_id: string;
}
