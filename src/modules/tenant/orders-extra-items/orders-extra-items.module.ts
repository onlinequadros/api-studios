import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersExtraItem } from './entities/orders-extra-item.entity';
import { CompaniesModule } from 'src/modules/master/companies/companies.module';


@Module({
  imports: [TypeOrmModule.forFeature([OrdersExtraItem]), CompaniesModule],
  controllers: [],
  providers: []
})
export class OrdersExtraItemsModule {}
