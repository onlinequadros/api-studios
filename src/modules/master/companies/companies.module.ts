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
import { TenantService } from 'src/modules/tenant/tenant.service';
import { DatabaseProvider } from 'src/modules/shared/database/database.provider';
import { AddressService } from 'src/modules/tenant/address/address.service';
import { AlbumPhoto } from 'src/modules/tenant/album_photos/entities/album.entity';
import { Category } from 'src/modules/tenant/categories/entities/category.entity';
import { PhotoAlbumProduct } from 'src/modules/tenant/photos_album_product/entities/photo-album-product.entity';
import { PhotoProduct } from 'src/modules/tenant/photos_product/entities/photo-product.entity';
import { Product } from 'src/modules/tenant/products/entities/product.entity';
import { forwardRef } from '@nestjs/common';
import { ClientModule } from 'src/modules/tenant/clients/client.module';

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
  ],
  exports: [CompaniesService, CompanyRepository],
})
export class CompaniesModule {
  constructor(
    private readonly connection: Connection,
    private readonly configService: ConfigService,
    private readonly companyService: CompaniesService,
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
          const createdConnection: Connection = await createConnection({
            name: tenant.tenant_company,
            type: this.configService.get('CMS_POSTGRES_TYPE'),
            host: this.configService.get('CMS_POSTGRES_HOST'),
            port: +this.configService.get('CMS_POSTGRES_PORT'),
            username: this.configService.get('CMS_POSTGRES_USER'),
            password: this.configService.get('CMS_POSTGRES_PASSWORD'),
            database: tenant.tenant_company,
            entities: [
              Client,
              Address,
              User,
              Category,
              Product,
              AlbumPhoto,
              PhotoAlbumProduct,
              PhotoProduct,
            ], // TODO -> adiciona as entidades do tenant
            ssl: false,
            synchronize: false,
          });
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
