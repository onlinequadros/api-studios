import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { SendForgotPasswordMailDto } from './dto/send-forgot-password-mail.dto';
import { ForgotPasswordStudioService } from './forgot-password-studio.service';

@Controller('/authentic-user')
export class ForgotPasswordStudioController {
  constructor(
    private readonly forgotPasswordService: ForgotPasswordStudioService,
  ) {}

  @Post('/forgot-password')
  @ApiOperation({ summary: 'Recuperação de senha.' })
  async sendMail(@Body() forgotEmail: SendForgotPasswordMailDto) {
    return await this.forgotPasswordService.sendForgotPasswordMail(forgotEmail);
  }
}
