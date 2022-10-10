import { ApiResponseProperty } from '@nestjs/swagger';
import { ValidateAuthDto } from './validate-auth.dto';

export class LoginResponseDto {
  @ApiResponseProperty({ type: 'string' })
  access_token?: string;

  @ApiResponseProperty({ type: 'object' })
  user?: ValidateAuthDto;
}
