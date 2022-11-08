import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesModule } from 'src/modules/master/companies/companies.module';
import { Orders } from './entities/orders.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [TypeOrmModule.forFeature([Orders]), CompaniesModule],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}
