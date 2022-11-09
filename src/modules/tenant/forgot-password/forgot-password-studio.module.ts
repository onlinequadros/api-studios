import { Module } from '@nestjs/common';
import { ForgotPasswordStudioService } from './forgot-password-studio.service';
import { ForgotPasswordStudioController } from './forgot-password-studio.controller';
import { MailsStudioModule } from '../mails/mail-studio.module';
import { UserModule } from '../users/user.module';
import { UsersTokensModule } from 'src/modules/master/users-tokens/users-tokens.module';

@Module({
  imports: [MailsStudioModule, UserModule, UsersTokensModule],
  controllers: [ForgotPasswordStudioController],
  providers: [ForgotPasswordStudioService],
})
export class ForgotPasswordStudioModule {}
