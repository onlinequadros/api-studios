import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SendForgotPasswordMailDto } from './dto/send-forgot-password-mail.dto';
import { ForgotPasswordService } from './forgot-password.service';

@ApiTags('Passwords')
@Controller('forgot-password')
export class ForgotPasswordController {
  constructor(private readonly forgotPasswordService: ForgotPasswordService) {}

  @ApiBadRequestResponse({ description: 'Usuário não existente' })
  @Post('')
  @ApiOperation({ summary: 'Recuperação de senha. ' })
  async sendMail(
    @Body(new ValidationPipe())
    sendForgotPasswordMailDto: SendForgotPasswordMailDto,
  ) {
    return await this.forgotPasswordService.sendForgotPasswordMail(
      sendForgotPasswordMailDto.email,
    );
  }

  @Get('validation')
  @ApiOperation({ summary: 'Validação do Token para recuperação de senha. ' })
  @ApiBadRequestResponse({ description: 'Token invalido' })
  async validationToken(@Query('token') token: string) {
    return await this.forgotPasswordService.validationToken(token);
  }
}
