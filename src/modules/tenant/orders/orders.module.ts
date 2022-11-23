import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesModule } from '../../../modules/master/companies/companies.module';
import { OrdersExtraItem } from './entities/orders-extra-item.entity';
import { Orders } from './entities/orders.entity';
import { OrdersPhotos } from './entities/ordersPhotos.entity';
import { OrdersExtraPhotos } from './entities/orders_extra_photos.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [TypeOrmModule.forFeature([Orders, OrdersPhotos,OrdersExtraItem, OrdersExtraPhotos]), CompaniesModule],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}
