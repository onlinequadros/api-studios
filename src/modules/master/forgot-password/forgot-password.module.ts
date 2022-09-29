import { Module } from '@nestjs/common';
import { ForgotPasswordService } from './forgot-password.service';
import { ForgotPasswordController } from './forgot-password.controller';
import { CompaniesModule } from '../companies/companies.module';
import { MailsModule } from '../mails/mail.module';
import { UsersTokensModule } from '../users-tokens/users-tokens.module';

@Module({
  imports: [MailsModule, CompaniesModule, UsersTokensModule],
  controllers: [ForgotPasswordController],
  providers: [ForgotPasswordService],
})
export class ForgotPasswordModule {}
