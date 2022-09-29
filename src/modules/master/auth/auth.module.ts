import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { CompaniesModule } from '../companies/companies.module';
import { MailsModule } from '../mails/mail.module';
import { config } from 'src/config/configurations';

@Module({
  imports: [
    CompaniesModule,
    PassportModule,
    MailsModule,

    JwtModule.register({
      secret: config.JWT_CONSTANTS.secret,
      signOptions: { expiresIn: config.JWT_CONSTANTS.expireIn },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
