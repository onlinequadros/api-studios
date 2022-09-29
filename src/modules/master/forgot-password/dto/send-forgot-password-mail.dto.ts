import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SendForgotPasswordMailDto {
  @IsEmail()
  @ApiProperty({ type: 'string', default: 'user@email.com' })
  email: string;
}
