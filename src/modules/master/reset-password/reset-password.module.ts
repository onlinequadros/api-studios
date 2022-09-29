import { Module } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { ResetPasswordController } from './reset-password.controller';
import { CompaniesModule } from '../companies/companies.module';
import { UsersTokensModule } from '../users-tokens/users-tokens.module';

@Module({
  imports: [CompaniesModule, UsersTokensModule],
  controllers: [ResetPasswordController],
  providers: [ResetPasswordService],
  exports: [ResetPasswordService],
})
export class ResetPasswordModule {}
