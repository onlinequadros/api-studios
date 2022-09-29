import { PartialType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { CreateCategoryDto } from './create-category.dto';

export class ReadCategoryDto extends PartialType(CreateCategoryDto) {
  @IsString()
  @Expose()
  readonly id: string;
}
