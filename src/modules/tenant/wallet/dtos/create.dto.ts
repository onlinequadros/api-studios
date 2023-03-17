import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateWalletDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Id da ordem de serviço' })
  @Expose()
  readonly order_id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Id do produto' })
  @Expose()
  readonly product_id: string;

  @IsString()
  @IsIn(['INVALID', 'BLOCKED', 'DISPONIBLE'])
  @ApiProperty({ default: 'Status do pagamento' })
  @Expose()
  readonly status: 'INVALID' | 'BLOCKED' | 'DISPONIBLE';

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Valor da carteira' })
  @Expose()
  readonly value: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ default: false })
  @Expose()
  readonly withdraw_visible: boolean;

  @IsString()
  @IsIn(['ACCOMPLISHED', 'BLOCKED', 'AWAITRELEASE'])
  @ApiProperty({ default: 'Autorização de pagamento' })
  @Expose()
  readonly payment: 'ACCOMPLISHED' | 'BLOCKED' | 'AWAITRELEASE';
}
