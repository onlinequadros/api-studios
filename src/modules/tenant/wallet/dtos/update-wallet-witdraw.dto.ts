import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateWalletWitdrawDto {
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly id: string;

  @IsString()
  @IsIn(['APPROVED', 'ACCOMPLISHED', 'BLOCKED', 'AWAITRELEASE'])
  @ApiProperty({ default: 'Autorização de pagamento' })
  @Expose()
  readonly payment: 'APPROVED' | 'ACCOMPLISHED' | 'BLOCKED' | 'AWAITRELEASE';
}
