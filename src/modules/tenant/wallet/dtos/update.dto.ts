import { PartialType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateWalletDto } from './create.dto';

export class UpdateWalletDto extends PartialType(CreateWalletDto) {
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly id: string;
}
