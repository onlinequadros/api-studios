import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateProductArtistDto {
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

  @IsString()
  @IsOptional()
  @ApiProperty({ default: 'Foto do produto' })
  @Expose()
  readonly photo?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Foto do produto' })
  @Expose()
  readonly price: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ default: true })
  @Expose()
  readonly feature_photo: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({ default: 'URL do produto' })
  @Expose()
  readonly url?: string;
}
