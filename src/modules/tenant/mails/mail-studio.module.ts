import { Module } from '@nestjs/common';
import { MailsStudioService } from './mail-studio.service';

@Module({
  providers: [MailsStudioService],
  exports: [MailsStudioService],
})
export class MailsStudioModule {}
