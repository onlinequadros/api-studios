import { BadRequestException, Injectable } from '@nestjs/common';
import { resolve } from 'path';

import { MailsStudioService } from '../mails/mail-studio.service';
import { UserService } from '../users/user.service';
import { SendForgotPasswordMailDto } from './dto/send-forgot-password-mail.dto';

@Injectable()
export class ForgotPasswordStudioService {
  constructor(
    private readonly usersService: UserService,
    private readonly mailsService: MailsStudioService,
  ) {}

  async sendForgotPasswordMail(
    objectPassword: SendForgotPasswordMailDto,
  ): Promise<boolean> {
    const user = await this.usersService.findByEmail(objectPassword.email);

    if (!user) throw new BadRequestException('Usuário não existe!');

    const token = String(Math.floor(Math.random() * 90000) + 10000);

    const templatePath = resolve(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'views',
      'emails',
      'forgot-password.hbs',
    );

    const variables = {
      name: user.name,
      code: token,
      link: `${process.env.URL_PRINCIPAL}/${objectPassword.studio}/forgot-password?code=${token}`,
    };

    try {
      await this.mailsService.sendEmail(
        objectPassword.email,
        'Recuperação de senha',
        variables,
        templatePath,
      );

      const objectUser = Object.assign(user, {
        ...user,
        forgot_password: token,
      });

      await this.usersService.updateProfile(user.id, objectUser);

      return true;
    } catch (err) {
      throw new BadRequestException('Falha ao enviar e-mail de recuperação');
    }
  }
}
