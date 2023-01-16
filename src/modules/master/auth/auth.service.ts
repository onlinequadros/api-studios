import { compare } from 'bcryptjs';

import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CompaniesService } from '../companies/companies.service';
import { ValidateAuthDto } from './dto/validate-auth.dto';
import { resolve } from 'path';
import { MailsService } from '../mails/mail.service';
import * as dayjs from 'dayjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: CompaniesService,
    private readonly mailsService: MailsService,
  ) {}

  async validateUser(email: string, pass: string): Promise<ValidateAuthDto> {
    const user = await this.usersService.findByEmail(email);

    if (user && (await compare(pass, user.password))) {
      const {
        id,
        name,
        lastname,
        cpf,
        email,
        phone,
        sex,
        birth_date,
        cnpj,
        company_name,
        address,
        number,
        district,
        city,
        uf,
        cep,
        complement,
        segment,
        created_at,
        role,
        login_notification,
        validate_access,
        tenant_company,
      } = user;

      const resultValidate: ValidateAuthDto = {
        id,
        name,
        lastname,
        cpf,
        email,
        phone,
        sex,
        birth_date,
        cnpj,
        company_name,
        address,
        number,
        district,
        city,
        uf,
        cep,
        complement,
        segment,
        created_at,
        role,
        login_notification,
        validate_access,
        tenant_company,
      };

      // notificação de login por email;
      // if (user.login_notification) {
      //   const templatePath = resolve(
      //     __dirname,
      //     '..',
      //     '..',
      //     '..',
      //     'views',
      //     'emails',
      //     'login.hbs',
      //   );

      //   const variables = {
      //     name: user.name,
      //     email: email,
      //     datetime: dayjs().format('DD/MM/YYYY HH:mm'),
      //   };

      //   this.mailsService.sendEmail(
      //     email,
      //     'Login feito em sua conta',
      //     variables,
      //     templatePath,
      //   );
      // }

      return resultValidate;
    }
    return null;
  }

  async login(user: ValidateAuthDto) {
    const payload = {
      sub: user.id,
      role: user.role,
    };

    return {
      user,
      access_token: this.jwtService.sign(payload),
    };
  }

  //VALIDA O ACESSO AO SISTEMA GERADO PELO E-MAIL NA CRIAÇÃO DO USUÁRIO
  async validateAccessCode(code_access: string) {
    const user = await this.usersService.findCodeAccess(code_access);

    if (user) {
      user.validate_access = true;
      await this.usersService.update(user.id, user);
    } else {
      throw new BadRequestException({ message: 'Código inválido' });
    }
  }

  async resendEmail(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) throw new BadRequestException('Usuário não encontrado');

    const templatePath = resolve(
      __dirname,
      '..',
      '..',
      '..',
      'views',
      'emails',
      'confirmation-email.hbs',
    );

    const variables = {
      code: user.code_access,
    };

    await this.mailsService.sendEmail(
      email,
      'confirmação-cadastro Online Quadros',
      variables,
      templatePath,
    );
  }
}
