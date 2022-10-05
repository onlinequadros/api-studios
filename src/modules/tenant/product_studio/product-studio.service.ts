import {
  BadGatewayException,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ILike, Repository } from 'typeorm';
import { TenantProvider } from '../tenant.provider';
import { CreateProductStudioDto, ReadProductStudioDto } from './dtos';
import { ProductStudio } from './entity/product-studio.entity';
import {
  IReadProductsStudioParams,
  IResponseProductStudioData,
} from './interfaces/product-studio.interface';
import { ProductStudioDinamicRepository } from './repositories/product-studio.repository';

//CADA REQUEST QUE SE CHAMA NA APLICAÇÃO ELA VAI CRIAR UMA NOVA INSTANCIA DESSA CLASSE
@Injectable({ scope: Scope.REQUEST })
export class ProductStudioService {
  private productStudioRepository: Repository<ProductStudio>;

  getProductStudioRepository() {
    if (TenantProvider.connection) {
      this.productStudioRepository =
        TenantProvider.connection.getRepository(ProductStudio);
    }
  }

  constructor(
    private readonly productStudioDinamicRepository: ProductStudioDinamicRepository,
  ) {
    this.getProductStudioRepository();
  }

  // FUNÇÃO PARA BUSCAR TODOS OS PRODUTOS
  async findAll({
    limit = 10,
    page = 1,
    search = '',
  }: IReadProductsStudioParams): Promise<IResponseProductStudioData> {
    const where = [];

    if (search) {
      where.push({
        name: ILike(`%${search}%`),
      });
    }

    this.getProductStudioRepository();
    const [products, count] = await this.productStudioRepository.findAndCount({
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
        return plainToClass(ReadProductStudioDto, product);
      }),
    };
  }

  // FUNÇÃO PARA BUSCAR UM PRODUTO
  async findOneProduct(product_id: string): Promise<ReadProductStudioDto> {
    this.getProductStudioRepository();
    const product = await this.productStudioRepository.findOne({
      where: { id: product_id },
    });
    return plainToClass(ReadProductStudioDto, product);
  }

  // FUNÇÃO PARA CRIAR UM PRODUTO
  async create(product: CreateProductStudioDto): Promise<ReadProductStudioDto> {
    this.getProductStudioRepository();

    const slug = await this.productStudioDinamicRepository.verifySlug(
      product.slug.toLowerCase().trim(),
    );

    if (slug) {
      throw new UnauthorizedException(
        'Slug já em uso, por favor escolha outro.',
      );
    }

    try {
      const newProducStudio = this.productStudioRepository.create(product);
      const createdProduct = await this.productStudioRepository.save(
        newProducStudio,
      );
      return plainToClass(ReadProductStudioDto, createdProduct);
    } catch (err) {
      throw new BadGatewayException(err.message);
    }
  }
}
