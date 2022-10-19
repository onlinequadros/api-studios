import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ProductStudioPhoto } from '../../product_studio_photos/entities/product-studio-photo.entity';

@Entity('productstudio')
export class ProductStudio {
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

  @Column()
  active_deadline: boolean;

  @Column({ nullable: true })
  deadline?: Date;

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

  @OneToMany(
    () => ProductStudioPhoto,
    (studioPhoto) => studioPhoto.product_photo_id,
    {
      cascade: true,
      nullable: true,
    },
  )
  product_studio_photo?: ProductStudioPhoto[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  delete_at: Date;

  constructor() {
    if (!this.id) this.id = uuidv4();
  }
}
