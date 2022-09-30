import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductArtist } from './entity/product-artist.entity';
import { ProductArtistController } from './product-artist.controller';
import { ProductArtistService } from './product-artist.service';
import { ProductArtistDinamicRepository } from './repositories/product-studio.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductArtist])],
  controllers: [ProductArtistController],
  providers: [ProductArtistService, ProductArtistDinamicRepository],
  exports: [ProductArtistService, ProductArtistDinamicRepository],
})
export class ProductArtistModule {}
