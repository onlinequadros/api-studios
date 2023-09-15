import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateConfirmWalletDto {
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly id: string;
}
