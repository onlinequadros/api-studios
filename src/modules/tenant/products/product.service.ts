import {
  BadGatewayException,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ILike, Repository } from 'typeorm';
import { TenantProvider } from '../tenant.provider';
import { CreateProductDto, ReadProductDto } from './dto';
import { Product } from './entities/product.entity';
import {
  IReadProductsParams,
  IResponseProductData,
} from './interfaces/response-products.interface';
import { ProductDinamicRepository } from './repositories/products.repositories';

//CADA REQUEST QUE SE CHAMA NA APLICAÇÃO ELA VAI CRIAR UMA NOVA INSTANCIA DESSA CLASSE
@Injectable({ scope: Scope.REQUEST })
export class ProductService {
  private productRepository: Repository<Product>;

  getProductRepository() {
    if (TenantProvider.connection) {
      this.productRepository = TenantProvider.connection.getRepository(Product);
    }
  }

  constructor(
    private readonly productDinamicRepository: ProductDinamicRepository,
  ) {
    this.getProductRepository();
  }

  // FUNÇÃO PARA BUSCAR TODOS OS PRODUTOS
  async findAll({
    limit = 10,
    page = 1,
    search,
  }: IReadProductsParams): Promise<IResponseProductData> {
    const where = [];

    if (search) {
      where.push({
        name: ILike(`%${search}%`),
      });
    }

    this.getProductRepository();
    const [products, count] = await this.productRepository.findAndCount({
      relations: ['product_studio', 'product_artistic'],
      where,
      order: {
        created_at: 'DESC',
      },
      take: limit, // aqui pega a quantidade
      skip: (page - 1) * limit,
    });
    return {
      count,
      totalPages: Math.ceil(count / limit),
      data: products.map((product) => {
        return plainToClass(ReadProductDto, product);
      }),
    };
  }

  // FUNÇÃO PARA BUSCAR UM PRODUTO
  async findOneProduct(product_id: string): Promise<ReadProductDto> {
    this.getProductRepository();
    const product = await this.productRepository.findOne({
      where: { id: product_id },
    });
    return plainToClass(ReadProductDto, product);
  }

  // FUNÇÃO PARA CRIAR UM PRODUTO
  async create(product: CreateProductDto): Promise<ReadProductDto> {
    this.getProductRepository();

    const slug = await this.productDinamicRepository.verifySlug(
      product.slug.toLowerCase().trim(),
    );

    if (slug) {
      throw new UnauthorizedException(
        'Slug já em uso, por favor escolha outro.',
      );
    }

    try {
      const newProduc = this.productRepository.create(product);
      const createdProduct = await this.productRepository.save(newProduc);
      return plainToClass(ReadProductDto, createdProduct);
    } catch (err) {
      throw new BadGatewayException(err.message);
    }
  }
}
