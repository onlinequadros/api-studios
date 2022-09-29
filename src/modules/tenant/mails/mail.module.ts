import { Module } from '@nestjs/common';
import { MailsService } from './mail.service';

@Module({
  providers: [MailsService],
  exports: [MailsService],
})
export class MailsModule {}
