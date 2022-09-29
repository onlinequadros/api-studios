import { createConnection } from 'typeorm';
import { Client } from '../../tenant/clients/entities/client.entity';
import { Address } from '../../tenant/address/entities/address.entity';
import { User } from '../../tenant/users/entities/user.entity';
import { Category } from 'src/modules/tenant/categories/entities/category.entity';
import { Product } from 'src/modules/tenant/products/entities/product.entity';
import { AlbumPhoto } from 'src/modules/tenant/album_photos/entities/album.entity';
import { PhotoAlbumProduct } from 'src/modules/tenant/photos_album_product/entities/photo-album-product.entity';
import { PhotoProduct } from 'src/modules/tenant/photos_product/entities/photo-product.entity';

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
            Product,
            AlbumPhoto,
            PhotoAlbumProduct,
            PhotoProduct,
          ]
        : [],
      ssl: false,
      synchronize: true,
    });
  }
}
