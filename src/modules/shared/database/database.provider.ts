import { createConnection } from 'typeorm';
import { Client } from '../../tenant/clients/entities/client.entity';
import { Address } from '../../tenant/address/entities/address.entity';
import { User } from '../../tenant/users/entities/user.entity';
import { Category } from 'src/modules/tenant/categories/entities/category.entity';
import { ProductStudio } from 'src/modules/tenant/product_studio/entity/product-studio.entity';
import { ProductArtist } from 'src/modules/tenant/product_artist/entity/product-artist.entity';
import { ProductStudioPhoto } from 'src/modules/tenant/product_studio_photos/entities/product-studio-photo.entity';

export class DatabaseProvider {
  async getConnection(database: string, isTenant = false) {
    return createConnection({
      name: database,
      type: 'postgres',
      host: process.env.CMS_POSTGRES_HOST,
      port: +process.env.CMS_POSTGRES_PORT,
      username: process.env.CMS_POSTGRES_USER,
      password: process.env.CMS_POSTGRES_PASSWORD,
      database: database,
      entities: isTenant
        ? [
            Client,
            Address,
            User,
            Category,
            ProductStudio,
            ProductArtist,
            ProductStudioPhoto,
          ]
        : [],
      ssl: false,
      synchronize: true,
    });
  }
}
