import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @MinLength(6)
  @ApiProperty({ type: 'string', default: '123456' })
  password: string;

  @IsString()
  @ApiProperty({ type: 'string', default: '12345' })
  token: string;
}
