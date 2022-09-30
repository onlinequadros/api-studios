import { Module } from '@nestjs/common';
import { CompaniesModule } from 'src/modules/master/companies/companies.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductStudioPhoto } from './entities/product-studio-photo.entity';
import { ProductStudioPhotoController } from './product-studio-photo.controller';
import { ProductStudioPhotoService } from './product-studio-photo.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductStudioPhoto]),
    CompaniesModule,
    // ProductModule,
  ],
  controllers: [ProductStudioPhotoController],
  providers: [ProductStudioPhotoService],
  exports: [ProductStudioPhotoService],
})
export class ProductStudioPhotoModule {}
