import { ApiResponseProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiResponseProperty({ type: 'string' })
  access_token?: string;

  @ApiResponseProperty({ type: 'object' })
  user?: any;
}
