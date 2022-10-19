import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateProductStudioPhotoDto {
  readonly products_id: string;
  readonly category: string;

  @IsNotEmpty()
  @ApiProperty({ default: 'Multiplas imagens' })
  @Expose()
  readonly photos: [
    {
      image: string,
      feature_photo?: boolean,
    }
  ]

  // @IsBoolean()
  // @ApiProperty()
  // @Expose()
  // @IsNotEmpty()
  // readonly feature_photo?: boolean;
}
