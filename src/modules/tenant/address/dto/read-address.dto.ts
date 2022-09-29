import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class ReadAddressDto {
  @IsNumber()
  @Expose()
  readonly id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Nome do endereço' })
  @Expose()
  readonly address_name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Número do endereço' })
  @Expose()
  readonly number: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Bairro' })
  @Expose()
  readonly district: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Cidade' })
  @Expose()
  readonly city: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Estado' })
  @Expose()
  readonly uf: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'CEP do endereço' })
  @Expose()
  readonly cep: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Complemento' })
  @Expose()
  readonly complement: string;
}
