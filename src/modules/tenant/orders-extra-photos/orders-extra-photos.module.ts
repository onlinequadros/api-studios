import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesModule } from '../../../modules/master/companies/companies.module';
import { OrdersExtraPhotos } from './entities/orders_extra_photos.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrdersExtraPhotos]), CompaniesModule],
  controllers: [],
  providers: [],
})
export class OrdersExtraPhotosModule {}
