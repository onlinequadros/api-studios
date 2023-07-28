import { Module } from '@nestjs/common';
import { CronSendMessageService } from './cron-send-message.service';
import { ProductStudioModule } from '../product_studio/product-studio.module';
import { CompaniesModule } from 'src/modules/master/companies/companies.module';
import { MailsStudioModule } from '../mails/mail-studio.module';

@Module({
  imports: [ProductStudioModule, CompaniesModule, MailsStudioModule],
  providers: [CronSendMessageService],
})
export class CronSendMessageModule {}
