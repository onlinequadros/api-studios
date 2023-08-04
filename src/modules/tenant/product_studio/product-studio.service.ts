import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { BucketS3Service } from '../../../bucket-s3/bucket-s3.service';
import { ILike, Repository } from 'typeorm';
import { TenantProvider } from '../tenant.provider';
import { CreateProductStudioDto, ReadProductStudioDto } from './dtos';
import { ProductStudio } from './entity/product-studio.entity';
import {
  IReadProductsStudioParams,
  IResponseProductStudioData,
} from './interfaces/product-studio.interface';
import { ProductStudioDinamicRepository } from './repositories/product-studio.repository';
import { MessagesHelper } from '../../../helpers/messages.helpers';
import { checkCompany } from '../../../modules/utils/checkCompany';
import { UpdateProductStudioDTO } from './dtos/updateProduct.dto';
import { DatabaseProvider } from 'src/modules/shared/database/database.provider';
import { CompaniesService } from 'src/modules/master/companies/companies.service';

//CADA REQUEST QUE SE CHAMA NA APLICAÇÃO ELA VAI CRIAR UMA NOVA INSTANCIA DESSA CLASSE
@Injectable({ scope: Scope.DEFAULT })
export class ProductStudioService {
  private productStudioRepository: Repository<ProductStudio>;
  private productStudioRepository2: Repository<ProductStudio>;

  getProductStudioRepository() {
    if (TenantProvider.connection) {
      this.productStudioRepository =
        TenantProvider.connection.getRepository(ProductStudio);
    }
  }

  constructor(
    private readonly productStudioDinamicRepository: ProductStudioDinamicRepository,
    private readonly s3Service: BucketS3Service,
    private readonly companiesService: CompaniesService,
  ) {
    this.getProductStudioRepository();
  }

  // FUNÇÃO PARA BUSCAR TODOS OS PRODUTOS
  async findAll({
    limit = 100,
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
      relations: ['product_studio_photo'],
    });
    products.map((element) => {
      element.product_studio_photo = element.product_studio_photo.filter(
        (item) => item.feature_photo == true,
      );
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
  // async findOne(slug: string): Promise<ReadProductStudioDto> {
  //   this.getProductStudioRepository();
  //   const product = await this.productStudioRepository.findOne({
  //     where: { slug },
  //     relations: ['product_studio_photo', 'users'],
  //   });

  //   if (!product) {
  //     throw new NotFoundException(MessagesHelper.PRODUCT_NOT_FOUND);
  //   }

  //   return plainToClass(ReadProductStudioDto, product);
  // }

  // FUNÇÃO PARA BUSCAR UM PRODUTO COM QUERY BUILDER
  async findOne(slug: string): Promise<ReadProductStudioDto> {
    this.getProductStudioRepository();

    const product = await this.productStudioRepository
      .createQueryBuilder('product_studio')
      .where('product_studio.slug = :slug', { slug: slug })
      .leftJoinAndSelect(
        'product_studio.product_studio_photo',
        'product_studio_photo',
      )
      .leftJoinAndSelect('product_studio.users', 'users')
      .orderBy('product_studio_photo.created_at', 'ASC')
      .addOrderBy('users.created_at', 'ASC')
      .getOne();

    if (!product) {
      throw new NotFoundException(MessagesHelper.PRODUCT_NOT_FOUND);
    }

    return plainToInstance(ReadProductStudioDto, product);
  }

  // FUNÇÃO PARA BUSCAR AS IMAGENS PARA O ARQUIVO ZIP
  async findImagesInZip(slug: string): Promise<ReadProductStudioDto> {
    this.getProductStudioRepository();
    const product = await this.productStudioRepository.findOne({
      where: { slug },
      relations: ['product_studio_photo'],
      select: ['id', 'product_studio_photo'],
    });

    if (!product) {
      throw new NotFoundException(MessagesHelper.PRODUCT_NOT_FOUND);
    }

    return plainToClass(ReadProductStudioDto, product);
  }

  // FUNÇÃO PARA BUSCAR AS IMAGENS DE UM PRODUTO
  async findImages(slug: string): Promise<ReadProductStudioDto> {
    this.getProductStudioRepository();
    const product = await this.productStudioRepository.findOne({
      where: { slug },
      relations: ['product_studio_photo'],
      select: ['id', 'amount_photos', 'product_studio_photo'],
    });

    if (!product) {
      throw new NotFoundException(MessagesHelper.PRODUCT_NOT_FOUND);
    }

    return plainToClass(ReadProductStudioDto, product);
  }

  async findById(id: string): Promise<ReadProductStudioDto> {
    this.getProductStudioRepository();
    const product = await this.productStudioRepository.findOne({
      where: { id: id },
    });

    if (!product) {
      throw new NotFoundException(MessagesHelper.PRODUCT_NOT_FOUND);
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
      relations: ['product_studio_photo', 'users'],
    });
  }

  // FUNÇÃO PARA CRIAR UM PRODUTO
  async create(
    request,
    product: CreateProductStudioDto,
  ): Promise<ReadProductStudioDto> {
    this.getProductStudioRepository();

    const company = await checkCompany(request);

    const slug = await this.productStudioDinamicRepository.verifySlug(
      product.slug.toLowerCase().trim(),
    );

    if (slug) {
      throw new UnauthorizedException(MessagesHelper.SLUG_ALREADY_IN_USE);
    }

    try {
      const newProducStudio = this.productStudioRepository.create(product);
      const createdProduct = await this.productStudioRepository.save(
        newProducStudio,
      );
      await this.s3Service.createProductFolder(
        company,
        product.category,
        product.slug,
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

  // async update(id: string, photos: []) {
  //   this.getProductStudioRepository();
  // }

  async deleteProduct(request, id: string): Promise<boolean> {
    this.getProductStudioRepository();

    const company = await checkCompany(request);

    const { category, slug } = await this.productStudioRepository.findOne({
      id: id,
    });

    const product = await this.productStudioRepository.softDelete({
      id: id,
    });

    if (!product.affected) {
      throw new BadRequestException({
        statusCode: 400,
        message: MessagesHelper.UNABLE_TO_REMOVE_ALBUM,
        available: false,
      });
    }

    await this.s3Service.deleteProductFolder(company, category, slug);
    return true;
  }

  async update(
    updateProductDTO: UpdateProductStudioDTO,
  ): Promise<ReadProductStudioDto> {
    try {
      const product = await this.findOneProduct(updateProductDTO['id']);
      const newProducts = updateProductDTO['users'][0]['id'];

      product.users.forEach((user) => {
        if (user.id == newProducts) {
          throw new BadRequestException('Usuário já vinculado ao studio.');
        }
        updateProductDTO['users'].push({ id: user.id });
      });

      const updatedProduct = await this.productStudioRepository.save(
        updateProductDTO,
      );
      return plainToClass(ReadProductStudioDto, updatedProduct);
    } catch (err) {
      throw new BadGatewayException(err.message);
    }
  }

  async updateOneProduct(
    slug: string,
    updateProductStudio: UpdateProductStudioDTO,
  ): Promise<ReadProductStudioDto> {
    this.getProductStudioRepository();
    const product = await this.productStudioRepository.findOne({
      where: { slug: slug },
    });

    if (!product) {
      throw new NotFoundException(MessagesHelper.PRODUCT_NOT_FOUND);
    }

    const productModify = Object.assign(product, updateProductStudio);

    const productUpdatted = await this.productStudioRepository.save(
      productModify,
    );

    return plainToClass(ReadProductStudioDto, productUpdatted);
  }

  async updateAmountExtraPhotos(
    slug: string,
    updateAmountExtraPhoto: { amount_extra_photos: number },
  ): Promise<ReadProductStudioDto> {
    this.getProductStudioRepository();
    const product = await this.productStudioRepository.findOne({
      where: { slug: slug },
    });

    if (!product) {
      throw new NotFoundException(MessagesHelper.PRODUCT_NOT_FOUND);
    }

    const productModify = Object.assign(product, {
      ...product,
      amount_extra_photos: updateAmountExtraPhoto.amount_extra_photos,
    });

    const productUpdatted = await this.productStudioRepository.save(
      productModify,
    );

    return plainToClass(ReadProductStudioDto, productUpdatted);
  }

  async findAlbumsInStudio(studio: string) {
    TenantProvider.connection = await new DatabaseProvider().getConnection(
      studio,
      true,
    );

    this.productStudioRepository2 =
      TenantProvider.connection.getRepository(ProductStudio);

    const response = await this.productStudioRepository2
      .createQueryBuilder('product_studio')
      .leftJoinAndSelect('product_studio.users', 'users')
      .where('product_studio.active_deadline = :activeDeadline', {
        activeDeadline: true,
      })
      .select([
        'product_studio.id',
        'product_studio.name',
        'product_studio.deadline',
      ])
      .addSelect(['users.id', 'users.name', 'users.email'])
      .getMany();

    TenantProvider.connection.close();

    return response;
  }
}
