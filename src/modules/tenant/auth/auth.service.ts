import { compare } from 'bcryptjs';

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';

import { ValidateAuthDto } from './dto/validate-auth.dto';
import { TenantProvider } from '../tenant.provider';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { config } from 'src/config/configurations';

@Injectable()
export class AuthServiceTenant {
  private userRepository: Repository<User>;

  getUserRepository() {
    if (TenantProvider.connection) {
      this.userRepository = TenantProvider.connection.getRepository(User);
    }
  }

  constructor(private readonly jwtService: JwtService) {
    this.getUserRepository();
  }

  async validateUser(email: string, pass: string): Promise<ValidateAuthDto> {
    this.getUserRepository();

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || user.token_isvalid === false) {
      return null;
    }

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
        created_at,
        role,
        avatar,
        permissions,
        is_active,
        user_type,
        slug,
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
        created_at,
        role,
        avatar,
        permissions,
        is_active,
        user_type,
        slug,
      };

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

  async verifyUserAndLogin(email: string) {
    await this.getUserRepository();
    const user = await this.userRepository.findOne({
      where: { email: email },
      select: ['email'],
    });

    if (!user) {
      return { studio: undefined };
    }

    return { studio: TenantProvider.connection.name };
  }

  async verifyTokenIsExpired(token: string): Promise<boolean> {
    await this.getUserRepository();
    try {
      const decodedToken = jwt.verify(token, config.JWT_CONSTANTS.secret);
      const currentTimestamp = Math.floor(Date.now() / 1000);

      //   // Verifique se o token não expirou
      if (decodedToken && decodedToken['exp'] > currentTimestamp) {
        return true; // O token é válido e não expirou
      } else {
        return false; // O token está expirado
      }
    } catch (error) {
      return false; // O token é inválido
    }
  }
}
