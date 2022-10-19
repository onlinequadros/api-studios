import { Module } from '@nestjs/common';
import { CompaniesModule } from '../../../modules/master/companies/companies.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductStudioPhoto } from './entities/product-studio-photo.entity';
import { ProductStudioPhotoController } from './product-studio-photo.controller';
import { ProductStudioPhotoService } from './product-studio-photo.service';
import { BucketS3Service } from '../../../bucket-s3/bucket-s3.service';
import { EncryptedService } from '../../../modules/utils/encrypted.service';
import { ProductStudioService } from '../product_studio/product-studio.service';
import { ProductStudioDinamicRepository } from '../product_studio/repositories/product-studio.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductStudioPhoto]),
    CompaniesModule,
    // ProductModule,
  ],
  controllers: [ProductStudioPhotoController],
  providers: [
    ProductStudioPhotoService,
    ProductStudioService,
    BucketS3Service,
    EncryptedService,
    ProductStudioDinamicRepository,
  ],
  exports: [ProductStudioPhotoService],
})
export class ProductStudioPhotoModule {}
