import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ValidationEmailDto {
  @IsString()
  @ApiProperty({ type: String })
  code_access: string;
}
