import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BucketS3Service } from '../../../bucket-s3/bucket-s3.service';
import { LinkSharing } from './entity/link-sharing.entity';
import { LinkSharingController } from './link-sharing.controller';
import { LinkSharingService } from './link-sharing.service';
import { ProductStudioService } from '../product_studio/product-studio.service';
import { ProductStudio } from '../product_studio/entity/product-studio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LinkSharing, ProductStudio])],
  controllers: [LinkSharingController],
  providers: [LinkSharingService, BucketS3Service],
  exports: [LinkSharingService],
})
export class LinkSharingModule {}
