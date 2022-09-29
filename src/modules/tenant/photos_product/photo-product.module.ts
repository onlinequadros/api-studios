import { Module } from '@nestjs/common';
import { CompaniesModule } from 'src/modules/master/companies/companies.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoProduct } from './entities/photo-product.entity';
import { PhotoProductController } from './photo-product.controller';
import { PhotoProductService } from './photo-product.service';

@Module({
  imports: [TypeOrmModule.forFeature([PhotoProduct]), CompaniesModule],
  controllers: [PhotoProductController],
  providers: [PhotoProductService],
  exports: [PhotoProductService],
})
export class PhotoProductModule {}
