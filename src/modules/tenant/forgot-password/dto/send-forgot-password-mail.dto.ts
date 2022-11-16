import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SendForgotPasswordMailDto {
  @IsEmail()
  @ApiProperty({ type: 'string', default: 'user@email.com' })
  email: string;

  @IsString()
  @ApiProperty({ type: 'string', default: 'fotovida' })
  studio: string;
}
