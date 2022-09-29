import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesModule } from './modules/master/companies/companies.module';
import { UsersTokensModule } from './modules/master/users-tokens/users-tokens.module';
import { ResetPasswordModule } from './modules/master/reset-password/reset-password.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientModule } from './modules/tenant/clients/client.module';
import { AuthModule } from './modules/master/auth/auth.module';
import { ForgotPasswordModule } from './modules/master/forgot-password/forgot-password.module';
import { UserModule } from './modules/tenant/users/user.module';
import { AddressModule } from './modules/tenant/address/address.module';
import { AuthModuleTenant } from './modules/tenant/auth/auth.module';
import { ProductModule } from './modules/tenant/products/product.module';
import { CategoryModule } from './modules/tenant/categories/address.module';
import { AlbumPhotoModule } from './modules/tenant/album_photos/album-photo.module';
import { PhotoProductModule } from './modules/tenant/photos_product/photo-product.module';
import { PhotoAlbumProductModule } from './modules/tenant/photos_album_product/photo-album-product.module';
@Module({
  imports: [
    CompaniesModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: configService.get('CMS_POSTGRES_TYPE'),
        url: configService.get('DATABASE_URL'),
        autoLoadEntities: configService.get('CMS_POSTGRES_AUTOLOAD'),
        synchronize: configService.get('CMS_POSTGRES_SYNCHRONIZE'),
        logging: configService.get('CMS_POSTGRES_LOGGING'),
      }),
    }),

    AuthModule,
    UsersTokensModule,
    ForgotPasswordModule,
    ResetPasswordModule,

    AuthModuleTenant,
    ClientModule,
    UserModule,
    AddressModule,
    ProductModule,
    CategoryModule,
    AlbumPhotoModule,
    PhotoProductModule,
    PhotoAlbumProductModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  static port: number;
  constructor(private readonly configService: ConfigService) {
    AppModule.port = this.configService.get('SERVER_PORT');
  }
}
