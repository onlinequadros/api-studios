import { IsDefined, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDto {
  @IsString()
  @IsDefined()
  @ApiProperty({ default: 'user@fasters.com.br' })
  email: string;

  @IsDefined()
  @IsString()
  @ApiProperty({ default: '123456' })
  password: string;
}
