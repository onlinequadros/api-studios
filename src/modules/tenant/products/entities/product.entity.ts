import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { AlbumPhoto } from '../../album_photos/entities/album.entity';
import { PhotoProduct } from '../../photos_product/entities/photo-product.entity';

@Entity('products')
export class Product {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'enum', enum: ['Studio', 'Artista'] })
  type: string;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column({ type: String, array: true, nullable: true })
  client_user?: string[];

  @Column()
  sku_father: string;

  @Column()
  slug: string;

  @Column({ type: String, array: true, nullable: true })
  tags?: string[];

  @OneToOne(() => AlbumPhoto, (albumStudio) => albumStudio.product)
  product_studio?: AlbumPhoto;

  @OneToOne(() => PhotoProduct, (albumArtistic) => albumArtistic.product)
  product_artistic?: PhotoProduct;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) this.id = uuidv4();
  }
}
