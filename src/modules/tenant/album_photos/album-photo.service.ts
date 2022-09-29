import { BadGatewayException, Injectable, Scope } from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { TenantProvider } from '../tenant.provider';
import { CreateAlbumPhotoDto, ReadAlbumPhotoDto } from './dto';
import { AlbumPhoto } from './entities/album.entity';

//CADA REQUEST QUE SE CHAMA NA APLICAÇÃO ELA VAI CRIAR UMA NOVA INSTANCIA DESSA CLASSE
@Injectable({ scope: Scope.REQUEST })
export class AlbumPhotoService {
  private albumPhotoRepository: Repository<AlbumPhoto>;

  getAlbumPhotoRepository() {
    if (TenantProvider.connection) {
      this.albumPhotoRepository =
        TenantProvider.connection.getRepository(AlbumPhoto);
    }
  }

  constructor() {
    this.getAlbumPhotoRepository();
  }

  async findAll(): Promise<ReadAlbumPhotoDto[]> {
    this.getAlbumPhotoRepository();
    const albumPhotos = await this.albumPhotoRepository.find();
    return albumPhotos.map((albumPhoto) =>
      plainToInstance(ReadAlbumPhotoDto, albumPhoto),
    );
  }

  async create(albumPhoto: CreateAlbumPhotoDto): Promise<ReadAlbumPhotoDto> {
    this.getAlbumPhotoRepository();
    try {
      const newAlbumPhoto = this.albumPhotoRepository.create(albumPhoto);
      const createdAlbumPhoto = await this.albumPhotoRepository.save(
        newAlbumPhoto,
      );
      return plainToClass(ReadAlbumPhotoDto, createdAlbumPhoto);
    } catch (err) {
      throw new BadGatewayException(err.message);
    }
  }
}
