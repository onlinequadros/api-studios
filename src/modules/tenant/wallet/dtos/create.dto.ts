import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsIn,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
} from 'class-validator';

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

  @IsNumber()
  @IsNotEmpty()
  @Expose()
  number_order: number;

  @IsString()
  @IsNotEmpty()
  @Expose()
  name_client: string;

  @IsNotEmpty()
  @IsNumber()
  percentage_studio: number;

  @IsNotEmpty()
  @IsNumber()
  percentage_photograph: number;

  @IsNotEmpty()
  @IsNumber()
  value_total_product_fisic: number;

  @IsNotEmpty()
  @IsNumber()
  value_total_photo_extra: number;

  @IsNotEmpty()
  @IsNumber()
  commission_studio_in_photo: number;

  @IsNotEmpty()
  @IsNumber()
  commission_photograph_in_frame: number;

  @IsNotEmpty()
  @IsNumber()
  value_total_frame_with_discount: number;

  @IsNotEmpty()
  @IsNumber()
  value_total_photograph_with_discount: number;

  @IsNotEmpty()
  @IsNumber()
  value_total_photograph_with_frame: number;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ default: false })
  @Expose()
  readonly withdraw_visible: boolean;

  @IsString()
  @IsIn(['APPROVED', 'ACCOMPLISHED', 'BLOCKED', 'AWAITRELEASE'])
  @ApiProperty({ default: 'Autorização de pagamento' })
  @Expose()
  readonly payment: 'APPROVED' | 'ACCOMPLISHED' | 'BLOCKED' | 'AWAITRELEASE';
}
