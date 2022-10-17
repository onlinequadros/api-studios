import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
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
  async findOne(slug: string): Promise<ReadProductStudioDto> {
    this.getProductStudioRepository();
    const product = await this.productStudioRepository.findOne({
      where: { slug },
    });

    if (!product) {
      throw new NotFoundException('Nada encontrado');
    }

    return plainToClass(ReadProductStudioDto, product);
  }

  // FUNÇÃO PARA BUSCAR UM PRODUTO E RELAÇÕES
  async findOneProduct(id) {
    this.getProductStudioRepository();
    return await this.productStudioRepository.findOne({
      where: {
        id: id,
      },
      relations: ['product_studio_photo'],
    });
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

  async validateSlugIsUnique(slug: string): Promise<{ available: boolean }> {
    this.getProductStudioRepository();
    const slugExists = await this.productStudioDinamicRepository.verifySlug(
      slug,
    );

    if (slugExists)
      throw new BadRequestException({
        statusCode: 400,
        message: 'Slug já em uso.',
        available: false,
      });

    return { available: true };
  }

  async update(id: string, photos: []) {
    this.getProductStudioRepository();

  }

  async deleteProduct(id: string): Promise<boolean> {
    this.getProductStudioRepository();

    const product = await this.productStudioRepository.softDelete({
      id: id,
    });

    if (!product.affected) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Não foi possível remover o álbum.',
        available: false,
      });
    }

    return true;
  }
}
