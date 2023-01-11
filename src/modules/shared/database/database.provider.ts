import { createConnection } from 'typeorm';
import { Client } from '../../tenant/clients/entities/client.entity';
import { Address } from '../../tenant/address/entities/address.entity';
import { User } from '../../tenant/users/entities/user.entity';
import { Category } from '../../../modules/tenant/categories/entities/category.entity';
import { ProductStudio } from '../../../modules/tenant/product_studio/entity/product-studio.entity';
import { ProductArtist } from '../../../modules/tenant/product_artist/entity/product-artist.entity';
import { ProductStudioPhoto } from '../../../modules/tenant/product_studio_photos/entities/product-studio-photo.entity';
import { Orders } from '../../../modules/tenant/orders/entities/orders.entity';
import { OrdersPhotos } from '../../../modules/tenant/orders/entities/ordersPhotos.entity';
import { OrdersExtraItem } from '../../../modules/tenant/orders/entities/orders-extra-item.entity';
import { OrdersExtraPhotos } from '../../../modules/tenant/orders/entities/orders_extra_photos.entity';
import { LinkSharing } from '../../tenant/link_sharing/entity/link-sharing.entity';

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
            Orders,
            OrdersPhotos,
            OrdersExtraItem,
            OrdersExtraPhotos,
            LinkSharing,
          ]
        : [],
      ssl: false,
      synchronize: true,
    });
  }
}
