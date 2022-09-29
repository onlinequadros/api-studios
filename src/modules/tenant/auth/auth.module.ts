import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthControllerTenant } from './auth.controller';
import { AuthServiceTenant } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MailsModule } from '../mails/mail.module';
import { config } from 'src/config/configurations';
import { UserModule } from '../users/user.module';
import { LocaltenantStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    MailsModule,

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
