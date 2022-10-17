import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class ReadProductStudioPhotoDto {
  @IsString()
  @Expose()
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Photos' })
  @Expose()
  readonly photo: [];

  // @IsBoolean()
  // @ApiProperty()
  // @Expose()
  // readonly feature_photo?: boolean;
}
