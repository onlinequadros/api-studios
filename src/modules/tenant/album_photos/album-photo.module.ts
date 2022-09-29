import { Module } from '@nestjs/common';
import { CompaniesModule } from 'src/modules/master/companies/companies.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumPhoto } from './entities/album.entity';
import { AlbumPhotoController } from './album-photo.controller';
import { AlbumPhotoService } from './album-photo.service';

@Module({
  imports: [TypeOrmModule.forFeature([AlbumPhoto]), CompaniesModule],
  controllers: [AlbumPhotoController],
  providers: [AlbumPhotoService],
  exports: [AlbumPhotoService],
})
export class AlbumPhotoModule {}
