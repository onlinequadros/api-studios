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
import { ImagesService } from '../../../modules/utils/images.service';
import { ProductsModule } from 'src/modules/master/products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductStudioPhoto]),
    CompaniesModule,
    ProductsModule,
  ],
  controllers: [ProductStudioPhotoController],
  providers: [
    ProductStudioPhotoService,
    ProductStudioService,
    BucketS3Service,
    EncryptedService,
    ProductStudioDinamicRepository,
    ImagesService,
  ],
  exports: [ProductStudioPhotoService],
})
export class ProductStudioPhotoModule {}
