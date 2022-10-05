import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDate,
} from 'class-validator';

export class CreateProductStudioDto {
  @IsString()
  @IsIn(['Studio', 'Artista'])
  @ApiProperty({ default: 'Studio' })
  @Expose()
  readonly type: 'Studio' | 'Artista';

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Nome do produto' })
  @Expose()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Categoria do produto' })
  @Expose()
  readonly category: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  @Expose()
  readonly client_user: string[];

  @IsOptional()
  @IsString()
  @ApiProperty()
  @Expose()
  readonly tags: string[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Código do produto' })
  @Expose()
  readonly sku_father: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Slug do produto' })
  @Expose()
  readonly slug: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ default: true })
  @Expose()
  readonly active_deadline: boolean;

  @IsOptional()
  @ApiProperty({ default: 'Disponível até' })
  @Expose()
  readonly deadline?: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ default: 'Quantidade de fotos' })
  @Expose()
  readonly amount_photos: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ default: 'Quantidade de fotos extras' })
  @Expose()
  readonly amount_extra_photos: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Valor pelas fotos extras' })
  @Expose()
  readonly price_extra_photos: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ default: 'Quantidade de um terço das fotos' })
  @Expose()
  readonly one_third_photos: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ default: 'Quantidade de dois terço das fotos' })
  @Expose()
  readonly two_third_photos: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ default: 'Quantidade total de fotos' })
  @Expose()
  readonly full_fotos: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Valor do desconto de um terço das fotos' })
  @Expose()
  readonly discount_one_third_photos: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Valor do desconto de dois terço das fotos' })
  @Expose()
  readonly discount_two_third_photos: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Valor do desconto de todas as fotos' })
  @Expose()
  readonly discount_full_photos: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Quantidade de fotos reservadas' })
  @Expose()
  readonly amount_receivable: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Identificador do producto relacionado' })
  @Expose()
  readonly product_id: string;
}
