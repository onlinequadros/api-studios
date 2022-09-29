import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreatePhotoProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Nome da foto' })
  @Expose()
  readonly photo: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Preço da foto' })
  @Expose()
  readonly price: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Código do produto' })
  @Expose()
  readonly sku: string;

  @IsBoolean()
  @ApiProperty()
  @Expose()
  readonly feature_photo: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty()
  @Expose()
  readonly tags: string[];
}
