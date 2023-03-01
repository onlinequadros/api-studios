import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesModule } from 'src/modules/master/companies/companies.module';
import { ProductStudio } from '../product_studio/entity/product-studio.entity';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';
import { Orders } from '../orders/entities/orders.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductStudio, Orders]), CompaniesModule],
  controllers: [FinanceController],
  providers: [FinanceService],
})
export class FinanceModule {}
