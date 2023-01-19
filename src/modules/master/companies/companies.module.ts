import {
  BadRequestException,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { CompanyRepository } from './repositories/companies.repository';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { MailsModule } from '../mails/mail.module';
import { Connection, createConnection, getConnection } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';
import { Client } from '../../tenant/clients/entities/client.entity';
import { Address } from '../../tenant/address/entities/address.entity';
import { User } from '../../tenant/users/entities/user.entity';
import { TenantProvider } from '../../tenant/tenant.provider';
import { TenantService } from '../../../modules/tenant/tenant.service';
import { DatabaseProvider } from '../../../modules/shared/database/database.provider';
import { AddressService } from '../../../modules/tenant/address/address.service';
import { Category } from '../../../modules/tenant/categories/entities/category.entity';
import { forwardRef } from '@nestjs/common';
import { ClientModule } from '../../../modules/tenant/clients/client.module';
import { ProductStudio } from '../../../modules/tenant/product_studio/entity/product-studio.entity';
import { ProductArtist } from '../../../modules/tenant/product_artist/entity/product-artist.entity';
import { ProductStudioPhoto } from '../../../modules/tenant/product_studio_photos/entities/product-studio-photo.entity';
import { BucketS3Service } from '../../../bucket-s3/bucket-s3.service';
import { EncryptedService } from '../../../modules/utils/encrypted.service';
import { Orders } from '../../../modules/tenant/orders/entities/orders.entity';
import { OrdersPhotos } from '../../../modules/tenant/orders/entities/ordersPhotos.entity';
import { OrdersExtraPhotos } from '../../../modules/tenant/orders/entities/orders_extra_photos.entity';
import { OrdersExtraItem } from '../../../modules/tenant/orders/entities/orders-extra-item.entity';
import { LinkSharing } from '../../tenant/link_sharing/entity/link-sharing.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company]),
    MailsModule,
    forwardRef(() => ClientModule),
  ],
  controllers: [CompaniesController],
  providers: [
    CompaniesService,
    CompanyRepository,
    AddressService,
    TenantService,
    DatabaseProvider,
    BucketS3Service,
    EncryptedService,
  ],
  exports: [CompaniesService, CompanyRepository],
})
export class CompaniesModule {
  constructor(
    private readonly connection: Connection,
    private readonly configService: ConfigService,
    private readonly companyService: CompaniesService,
    private readonly databaseProvider: DatabaseProvider,
  ) {}
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(async (req: Request, res: Response, next: NextFunction) => {
        const companyRequest = req.params;
        const company = companyRequest['0'].split('/')[0];

        const tenant: Company = await this.companyService.findTenantCompany(
          company,
        );

        if (!tenant) {
          throw new BadRequestException(
            'Falha ao conectar a database',
            'Base de dados não existe',
          );
        }

        try {
          TenantProvider.connection = getConnection(tenant.tenant_company);
          next();
        } catch (e) {
          const databaseExists = await this.connection.query(
            `SELECT datname FROM pg_database WHERE datname = '${tenant.tenant_company}'`,
          );

          if (!databaseExists.length) {
            await this.connection.query(
              `CREATE DATABASE ${tenant.tenant_company}`,
            );
          }
          const createdConnection: Connection =
            await this.databaseProvider.getConnection(
              tenant.tenant_company,
              true,
              !databaseExists.length,
            );
          if (createdConnection) {
            TenantProvider.connection = createdConnection;
            next();
          } else {
            throw new BadRequestException(
              'Falha na conexão com a database.',
              'Houve um erro ao conectar com a base de dados!',
            );
          }
        }
      })
      .exclude(
        { path: '/api/tenants', method: RequestMethod.ALL },
        { path: '/api/auth/login', method: RequestMethod.ALL },
        { path: '/api/companies', method: RequestMethod.ALL },
        { path: '/api/companies/:id', method: RequestMethod.ALL },
        { path: '/api/companies/:id', method: RequestMethod.ALL },
        { path: '/api/shipping', method: RequestMethod.ALL },
        { path: '/api/shipping/:company', method: RequestMethod.ALL },
        { path: '/api/images-crop', method: RequestMethod.ALL },
        { path: '/api/products', method: RequestMethod.ALL },
        {
          path: '/api/products/list-frames/:frame/:size',
          method: RequestMethod.ALL,
        },
        { path: '/api/products/:id', method: RequestMethod.ALL },
        { path: '/api/products/guidance/:type', method: RequestMethod.ALL },
        { path: '/api/companies/orders', method: RequestMethod.ALL },
        { path: '/api/companies/orders/:id', method: RequestMethod.ALL },
        {
          path: '/api/companies/orders/extra-photos/:id',
          method: RequestMethod.ALL,
        },
        {
          path: '/api/companies/orders/extra-items/:id',
          method: RequestMethod.ALL,
        },
        {
          path: '/api/companies/validation-cpf/:cpf',
          method: RequestMethod.ALL,
        },
        {
          path: '/api/companies/validation-cnpj/:cnpj',
          method: RequestMethod.ALL,
        },
        {
          path: '/api/companies/verify-complement/:complement',
          method: RequestMethod.ALL,
        },
        {
          path: '/api/companies/access-validation/:code',
          method: RequestMethod.ALL,
        },
        {
          path: '/api/companies/access-validation-code/:code',
          method: RequestMethod.ALL,
        },
        {
          path: '/api/companies/validation-email-code/:code',
          method: RequestMethod.ALL,
        },
        {
          path: '/api/companies/validation-email/:email',
          method: RequestMethod.ALL,
        },
        { path: '/api/auth/login', method: RequestMethod.ALL },
      )
      .forRoutes('*');
  }
}
