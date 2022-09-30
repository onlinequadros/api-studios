import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class ReadProductStudioPhotoDto {
  @IsString()
  @Expose()
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Nome da foto' })
  @Expose()
  readonly photo: string;

  @IsBoolean()
  @ApiProperty()
  @Expose()
  readonly feature_photo?: boolean;
}
