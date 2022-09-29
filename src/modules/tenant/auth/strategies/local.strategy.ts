import { Strategy } from 'passport-local';

import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { TenantProvider } from '../../tenant.provider';
import { User } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthServiceTenant } from '../auth.service';

@Injectable()
export class LocaltenantStrategy extends PassportStrategy(
  Strategy,
  'localTenant',
) {
  private userRepository: Repository<User>;

  getUserRepository() {
    if (TenantProvider.connection) {
      this.userRepository = TenantProvider.connection.getRepository(User);
    }
  }

  constructor(private authService: AuthServiceTenant) {
    super({ usernameField: 'email' });
    this.getUserRepository();
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);

    if (!user) throw new UnauthorizedException('E-mail ou senha inválido');

    return user;
  }
}
