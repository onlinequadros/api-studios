import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Id da categoria' })
  id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Nome da categoria' })
  @Expose()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Código da categoria' })
  @Expose()
  readonly sku: string;
}
