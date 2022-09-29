import { BadGatewayException, Injectable, Scope } from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { ProductDinamicRepository } from '../products/repositories/products.repositories';
import { TenantProvider } from '../tenant.provider';
import { CreatePhotoAlbumProductDto, ReadPhotoAlbumProductDto } from './dto';
import { PhotoAlbumProduct } from './entities/photo-album-product.entity';

//CADA REQUEST QUE SE CHAMA NA APLICAÇÃO ELA VAI CRIAR UMA NOVA INSTANCIA DESSA CLASSE
@Injectable({ scope: Scope.REQUEST })
export class PhotoAlbumProductService {
  private photoAlbumProductRepository: Repository<PhotoAlbumProduct>;

  getAlbumPhotoRepository() {
    if (TenantProvider.connection) {
      this.photoAlbumProductRepository =
        TenantProvider.connection.getRepository(PhotoAlbumProduct);
    }
  }

  constructor(
    private readonly productDinamicRepository: ProductDinamicRepository,
  ) {
    this.getAlbumPhotoRepository();
  }

  async findAll(): Promise<ReadPhotoAlbumProductDto[]> {
    this.getAlbumPhotoRepository();
    const photoAlbumProducts = await this.photoAlbumProductRepository.find();
    return photoAlbumProducts.map((photoAlbumProduct) =>
      plainToInstance(ReadPhotoAlbumProductDto, photoAlbumProduct),
    );
  }

  async create(
    photoAlbumProduct: CreatePhotoAlbumProductDto,
  ): Promise<ReadPhotoAlbumProductDto> {
    this.getAlbumPhotoRepository();
    try {
      const newPhotoAlbumProduct =
        this.photoAlbumProductRepository.create(photoAlbumProduct);
      const createdPhotoAlbumProduct =
        await this.photoAlbumProductRepository.save(newPhotoAlbumProduct);
      return plainToClass(ReadPhotoAlbumProductDto, createdPhotoAlbumProduct);
    } catch (err) {
      throw new BadGatewayException(err.message);
    }
  }
}
