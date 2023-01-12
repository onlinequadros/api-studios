import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateLinkSharingDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Nome do studio' })
  @Expose()
  readonly studio: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'nome do slug' })
  @Expose()
  readonly slug: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Link' })
  @Expose()
  readonly link: string;
}
