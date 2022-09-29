import { BadGatewayException, Injectable, Scope } from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { TenantProvider } from '../tenant.provider';
import { CreatePhotoProductDto, ReadPhotoProductDto } from './dto';
import { PhotoProduct } from './entities/photo-product.entity';

//CADA REQUEST QUE SE CHAMA NA APLICAÇÃO ELA VAI CRIAR UMA NOVA INSTANCIA DESSA CLASSE
@Injectable({ scope: Scope.REQUEST })
export class PhotoProductService {
  private photoProductRepository: Repository<PhotoProduct>;

  getAlbumPhotoRepository() {
    if (TenantProvider.connection) {
      this.photoProductRepository =
        TenantProvider.connection.getRepository(PhotoProduct);
    }
  }

  constructor() {
    this.getAlbumPhotoRepository();
  }

  async findAll(): Promise<ReadPhotoProductDto[]> {
    this.getAlbumPhotoRepository();
    const photoProducts = await this.photoProductRepository.find();
    return photoProducts.map((photoProduct) =>
      plainToInstance(ReadPhotoProductDto, photoProduct),
    );
  }

  async create(
    photoProduct: CreatePhotoProductDto,
  ): Promise<ReadPhotoProductDto> {
    this.getAlbumPhotoRepository();
    try {
      const newPhotoProduct = this.photoProductRepository.create(photoProduct);
      const createdPhotoProduct = await this.photoProductRepository.save(
        newPhotoProduct,
      );
      return plainToClass(ReadPhotoProductDto, createdPhotoProduct);
    } catch (err) {
      throw new BadGatewayException(err.message);
    }
  }
}
