import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export class CreatePassword {
  @IsEmail()
  @ApiProperty({ default: 'email@fasters.com.br' })
  @Expose()
  readonly email: string;

  @IsString()
  @Expose()
  readonly token: string;

  @IsString()
  @Expose()
  readonly password: string;
}
