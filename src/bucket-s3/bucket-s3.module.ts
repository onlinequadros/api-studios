import { Module } from '@nestjs/common';
import { BucketS3Service } from './bucket-s3.service';
import { BucketS3Controller } from './bucket-s3.controller';
import { EncryptedService } from '../modules/utils/encrypted.service';
import { ZipCacheModule } from 'src/modules/tenant/zip-cache/zip-cache.module';
import { MailsStudioModule } from 'src/modules/tenant/mails/mail-studio.module';

@Module({
  imports: [ZipCacheModule, MailsStudioModule],
  providers: [BucketS3Service, EncryptedService],
  controllers: [BucketS3Controller],
})
export class BucketS3Module {}
