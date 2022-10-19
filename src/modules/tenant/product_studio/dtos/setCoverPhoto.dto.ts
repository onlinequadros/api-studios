import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class SetCoverPhotoDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Id do produto' })
  @Expose()
  productId: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ default: 'Ativação foto de capa' })
  @Expose()
  isActive: boolean;
}