import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TenantProvider } from '../../tenant.provider';
import { ProductArtist } from '../entity/product-artist.entity';

@Injectable()
export class ProductArtistDinamicRepository {
  private repository: Repository<ProductArtist>;

  getProductArtistRepository() {
    if (TenantProvider.connection) {
      this.repository = TenantProvider.connection.getRepository(ProductArtist);
    }
  }

  constructor() {
    this.getProductArtistRepository();
  }

  async findOne(id: string): Promise<ProductArtist> {
    this.getProductArtistRepository();
    return await this.repository.findOne({ where: { id } });
  }

  async verifySlug(slug: string): Promise<ProductArtist> {
    this.getProductArtistRepository();
    return await this.repository.findOne({ where: { slug } });
  }
}
