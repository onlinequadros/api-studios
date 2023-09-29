import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { ResendValidationEmailDto } from './dto/resend-validation-email';
import { ValidationEmailDto } from './dto/validation-email.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @Patch('validate-email')
  @ApiOperation({
    summary: 'Rota para validar o e-mail pelo código enviado.',
  })
  async validateEmailAccess(
    @Query(new ValidationPipe())
    validationEmailDto: ValidationEmailDto,
  ) {
    await this.authService.validateAccessCode(validationEmailDto.code_access);
  }

  @Post('resend-email')
  @ApiOperation({
    summary: 'Reenvia o link de confirmação de cadastro de conta.',
  })
  async resend(
    @Body(new ValidationPipe())
    resendEmailDto: ResendValidationEmailDto,
  ) {
    return await this.authService.resendEmail(resendEmailDto.email);
  }

  @Get('token-is-valid')
  async ver(@Query('token') token: string): Promise<boolean> {
    return await this.authService.verifyTokenIsExpired(token);
  }
}
