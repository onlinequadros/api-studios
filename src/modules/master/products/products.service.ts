import { Injectable, NotFoundException } from '@nestjs/common';
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

  async create(createProductDTO: CreateProductDto): Promise<Product> {
    const product = await this.repository.create(createProductDTO);
    await this.repository.save(product);
    return product;
  }

  async findAll(): Promise<Product[]> {
    const products = await this.repository.find();
    return products;
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.repository.findOne(id);

    if (!product) {
      throw new NotFoundException('Produto não encontrado.');
    }

    return product;
  }

  async findGuidance(type: string) {
    return await this.repository.find({
      where: {
        guidance: type,
      },
    });
  }

  async findFrame(frame: string, size: string) {
    const listFilterDimensions = await this.repository.find({
      where: {
        guidance: frame,
        width_px: size.split('x')[0],
        height_px: size.split('x')[1],
      },
    });

    if (listFilterDimensions.length === 0) {
      throw new NotFoundException(
        'Nada encontrado na para ' + frame + ' no tamanho ' + size,
      );
    }

    const listFiltered = listFilterDimensions.map((item) => {
      return {
        id: item.id,
        img_frame: item.img_frame,
        img: item.img,
      };
    });

    return listFiltered;
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
