import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @ApiProperty({ type: 'string', default: 'senha_antiga' })
  old_password: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ type: 'string', default: 'nova_senha' })
  new_password: string;
}
