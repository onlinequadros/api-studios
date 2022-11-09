import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthControllerTenant } from './auth.controller';
import { AuthServiceTenant } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MailsStudioModule } from '../mails/mail-studio.module';
import { config } from 'src/config/configurations';
import { UserModule } from '../users/user.module';
import { LocaltenantStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    MailsStudioModule,

    JwtModule.register({
      secret: config.JWT_CONSTANTS.secret,
      signOptions: { expiresIn: config.JWT_CONSTANTS.expireIn },
    }),
  ],
  controllers: [AuthControllerTenant],
  providers: [AuthServiceTenant, LocaltenantStrategy, JwtStrategy],
  exports: [AuthServiceTenant],
})
export class AuthModuleTenant {}
