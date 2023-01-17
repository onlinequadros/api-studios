import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BucketS3Service } from 'src/bucket-s3/bucket-s3.service';
import { ProductStudioPhoto } from 'src/modules/tenant/product_studio_photos/entities/product-studio-photo.entity';
import { ImagesCropController } from './images-crop.controller';
import { ImageCropService } from './images-crop.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductStudioPhoto])],
  controllers: [ImagesCropController],
  providers: [ImageCropService, BucketS3Service],
})
export class ImagesCropModule {}
