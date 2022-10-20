import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class RemoveImagesDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ default: 'Id do produto' })
  @Expose()
  productId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Categoria do produto' })
  category: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ default: 'imagens a sereme excluidas' })
  images: [
    {
        id: string,
        photo: string
    }
  ];
}
