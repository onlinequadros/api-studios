import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthServiceTenant } from './auth.service';

import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Auth')
@Controller('authentic_user')
export class AuthControllerTenant {
  constructor(private readonly authService: AuthServiceTenant) {}

  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginRequestDto })
  @ApiOperation({
    summary:
      'Rota de login, em caso de sucesso gera um token JWT e retorna dados do usuário.',
  })
  @ApiUnauthorizedResponse({
    description: 'Usuário não autorizado',
  })
  @ApiOkResponse({
    description: 'Usuário autorizado',
    type: LoginResponseDto,
  })
  @Post('/login')
  async login(@Request() request) {
    return this.authService.login(request.user);
  }
}
