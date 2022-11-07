import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
  ) {}

  async create(createProductDTO: CreateProductDto) {
    const product = await this.repository.create(createProductDTO);
    await this.repository.save(product);
    return product;
  }

  async findAll(): Promise<Product[]> {
    const products = await this.repository.find();
    return products;
  }

  async findOne(id: string): Promise<Product> {
    return await this.repository.findOne(id);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);

    Object.assign(product, updateProductDto);

    const productUpdated = await this.repository.create(product);
    await this.repository.save(productUpdated);

    return productUpdated;
  }

  async remove(id: string) {
    const product = await this.repository.delete(id);
    return product;
  }
}
