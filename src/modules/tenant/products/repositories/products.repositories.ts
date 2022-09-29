import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TenantProvider } from '../../tenant.provider';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductDinamicRepository {
  private repository: Repository<Product>;

  getProductRepository() {
    if (TenantProvider.connection) {
      this.repository = TenantProvider.connection.getRepository(Product);
    }
  }

  constructor() {
    this.getProductRepository();
  }

  async findOne(id: string): Promise<Product> {
    this.getProductRepository();
    return await this.repository.findOne({ where: { id } });
  }

  async verifySlug(slug: string): Promise<Product> {
    this.getProductRepository();
    return await this.repository.findOne({ where: { slug } });
  }
}
