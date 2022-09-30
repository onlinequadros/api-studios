import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TenantProvider } from '../../tenant.provider';
import { ProductStudio } from '../entity/product-studio.entity';

@Injectable()
export class ProductStudioDinamicRepository {
  private repository: Repository<ProductStudio>;

  getProductStudioRepository() {
    if (TenantProvider.connection) {
      this.repository = TenantProvider.connection.getRepository(ProductStudio);
    }
  }

  constructor() {
    this.getProductStudioRepository();
  }

  async findOne(id: string): Promise<ProductStudio> {
    this.getProductStudioRepository();
    return await this.repository.findOne({ where: { id } });
  }

  async verifySlug(slug: string): Promise<ProductStudio> {
    this.getProductStudioRepository();
    return await this.repository.findOne({ where: { slug } });
  }
}
