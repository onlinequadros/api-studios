import { Module } from '@nestjs/common';
import { CompaniesModule } from 'src/modules/master/companies/companies.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoAlbumProduct } from './entities/photo-album-product.entity';
import { PhotoAlbumProductController } from './photo-album-product.controller';
import { PhotoAlbumProductService } from './photo-album-product.service';
import { ProductModule } from '../products/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PhotoAlbumProduct]),
    CompaniesModule,
    ProductModule,
  ],
  controllers: [PhotoAlbumProductController],
  providers: [PhotoAlbumProductService],
  exports: [PhotoAlbumProductService],
})
export class PhotoAlbumProductModule {}
