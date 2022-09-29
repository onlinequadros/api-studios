import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { PhotoAlbumProduct } from '../../photos_album_product/entities/photo-album-product.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('albumphoto')
export class AlbumPhoto {
  @PrimaryColumn()
  id: string;

  @Column()
  active_deadline: boolean;

  @Column()
  deadline: Date;

  @Column()
  amount_photos: number;

  @Column()
  amount_extra_photos: number;

  @Column()
  price_extra_photos: string;

  @Column()
  one_third_photos: number;

  @Column()
  two_third_photos: number;

  @Column()
  full_fotos: number;

  @Column()
  discount_one_third_photos: string;

  @Column()
  discount_two_third_photos: string;

  @Column()
  discount_full_photos: string;

  @Column()
  amount_receivable: string;

  @Column()
  product_id: string;

  @OneToOne(() => Product, (product) => product.product_studio)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @OneToMany(
    () => PhotoAlbumProduct,
    (albumPhoto) => albumPhoto.album_photos_id,
    {
      cascade: true,
      nullable: true,
    },
  )
  album_photo_product?: PhotoAlbumProduct[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) this.id = uuidv4();
  }
}
