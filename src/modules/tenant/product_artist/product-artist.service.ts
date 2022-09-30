import {
  BadGatewayException,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ILike, Repository } from 'typeorm';
import { TenantProvider } from '../tenant.provider';
import { CreateProductArtistDto, ReadProductArtistDto } from './dtos';
import { ProductArtist } from './entity/product-artist.entity';
import {
  IReadProductsArtistParams,
  IResponseProductArtisticData,
} from './interfaces/product-artist.interface';
import { ProductArtistDinamicRepository } from './repositories/product-studio.repository';

//CADA REQUEST QUE SE CHAMA NA APLICAÇÃO ELA VAI CRIAR UMA NOVA INSTANCIA DESSA CLASSE
@Injectable({ scope: Scope.REQUEST })
export class ProductArtistService {
  private productArtistRepository: Repository<ProductArtist>;

  getProductArtistRepository() {
    if (TenantProvider.connection) {
      this.productArtistRepository =
        TenantProvider.connection.getRepository(ProductArtist);
    }
  }

  constructor(
    private readonly productArtistDinamicRepository: ProductArtistDinamicRepository,
  ) {
    this.getProductArtistRepository();
  }

  // FUNÇÃO PARA BUSCAR TODOS OS PRODUTOS
  async findAll({
    limit = 10,
    page = 1,
    search,
  }: IReadProductsArtistParams): Promise<IResponseProductArtisticData> {
    const where = [];

    if (search) {
      where.push({
        name: ILike(`%${search}%`),
      });
    }

    this.getProductArtistRepository();
    const [products, count] = await this.productArtistRepository.findAndCount({
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
        return plainToClass(ReadProductArtistDto, product);
      }),
    };
  }

  // FUNÇÃO PARA BUSCAR UM PRODUTO
  async findOneProduct(product_id: string): Promise<ReadProductArtistDto> {
    this.getProductArtistRepository();
    const product = await this.productArtistRepository.findOne({
      where: { id: product_id },
    });
    return plainToClass(ReadProductArtistDto, product);
  }

  // FUNÇÃO PARA CRIAR UM PRODUTO
  async create(product: CreateProductArtistDto): Promise<ReadProductArtistDto> {
    this.getProductArtistRepository();

    const slug = await this.productArtistDinamicRepository.verifySlug(
      product.slug.toLowerCase().trim(),
    );

    if (slug) {
      throw new UnauthorizedException(
        'Slug já em uso, por favor escolha outro.',
      );
    }

    try {
      const newProducStudio = this.productArtistRepository.create(product);
      const createdProduct = await this.productArtistRepository.save(
        newProducStudio,
      );
      return plainToClass(ReadProductArtistDto, createdProduct);
    } catch (err) {
      throw new BadGatewayException(err.message);
    }
  }
}
