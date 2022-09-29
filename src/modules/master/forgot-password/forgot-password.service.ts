import { BadRequestException, Injectable } from '@nestjs/common';
import { resolve } from 'path';

import dayjs from 'dayjs';

import { MailsService } from '../mails/mail.service';
import { CompaniesService } from '../companies/companies.service';
import { UsersTokensRepository } from '../users-tokens/repositories/users-tokens.repository';

@Injectable()
export class ForgotPasswordService {
  constructor(
    private readonly usersService: CompaniesService,
    private readonly mailsService: MailsService,
    private readonly usersTokensRepository: UsersTokensRepository,
  ) {}

  async sendForgotPasswordMail(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);

    if (!user) throw new BadRequestException('Usuário não existe!');

    const token = String(Math.floor(Math.random() * 90000) + 10000);

    const templatePath = resolve(
      __dirname,
      '..',
      '..',
      '..',
      'views',
      'emails',
      'forgot-password.hbs',
    );

    const expires_date = dayjs().add(3, 'hours').toDate();

    await this.usersTokensRepository.create({
      refresh_token: token,
      user_id: user.id,
      expires_date,
    });

    const variables = {
      name: user.name,
      code: token,
    };

    await this.mailsService.sendEmail(
      email,
      'Recuperação de senha',
      variables,
      templatePath,
    );
  }

  async validationToken(token: string): Promise<void> {
    const userToken = await this.usersTokensRepository.findByRefreshToken(
      token,
    );

    if (!userToken) throw new BadRequestException('Código token invalido.');

    if (dayjs(userToken.expires_date).isBefore(dayjs().toDate()))
      throw new BadRequestException('Código token expirado!');
  }
}
