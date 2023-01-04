import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BucketS3Service } from '../../../bucket-s3/bucket-s3.service';
import { EncryptedService } from '../../../modules/utils/encrypted.service';
import { CompaniesModule } from '../../../modules/master/companies/companies.module';
import { ProductStudioService } from '../product_studio/product-studio.service';
import { ProductStudioDinamicRepository } from '../product_studio/repositories/product-studio.repository';
import { ProductStudioPhotoService } from '../product_studio_photos/product-studio-photo.service';
import { OrdersExtraItem } from './entities/orders-extra-item.entity';
import { Orders } from './entities/orders.entity';
import { OrdersPhotos } from './entities/ordersPhotos.entity';
import { OrdersExtraPhotos } from './entities/orders_extra_photos.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ImagesService } from '../../../modules/utils/images.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Orders,
      OrdersPhotos,
      OrdersExtraItem,
      OrdersExtraPhotos,
    ]),
    CompaniesModule,
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    ProductStudioPhotoService,
    BucketS3Service,
    EncryptedService,
    ImagesService,
    ProductStudioService,
    ProductStudioDinamicRepository,
  ],
})
export class OrdersModule {}
