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
import { CategoryModule } from './modules/tenant/categories/category.module';
import { ProductStudioModule } from './modules/tenant/product_studio/product-studio.module';
import { ProductArtistModule } from './modules/tenant/product_artist/product-studio.module';
import { ProductStudioPhotoModule } from './modules/tenant/product_studio_photos/product-studio-photo.module';
import { BucketS3Module } from './bucket-s3/bucket-s3.module';
import { ProductsModule } from './modules/master/products/products.module';
import { ForgotPasswordStudioModule } from './modules/tenant/forgot-password/forgot-password-studio.module';
import { OrdersModule } from './modules/tenant/orders/orders.module';
import { PaymentModule } from './modules/tenant/payment/payment.module';
import { HttpModule } from "@nestjs/axios";
import { ShippingModule } from './modules/tenant/shipping/shipping.module';

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
    ProductStudioModule,
    ProductArtistModule,
    ProductStudioPhotoModule,
    CategoryModule,
    BucketS3Module,
    ProductsModule,
    ForgotPasswordStudioModule,
    OrdersModule,
    PaymentModule,
    HttpModule,
    ShippingModule

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
