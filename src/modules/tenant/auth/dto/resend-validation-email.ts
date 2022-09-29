import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ResendValidationEmailDto {
  @IsEmail()
  @ApiProperty({ type: String })
  email: string;
}
