import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ProductStudio } from '../../product_studio/entity/product-studio.entity';

@Entity('productstudiophotos')
export class ProductStudioPhoto {
  @PrimaryColumn()
  id: string;

  @Column()
  photo: string;

  @Column({ nullable: true })
  feature_photo?: boolean;

  @Column({ select: false })
  url: string;

  @Column()
  low_resolution_image: string;

  @Column()
  checked: boolean;

  @Column()
  order: boolean;

  @ManyToOne(() => ProductStudio)
  @JoinColumn({ name: 'product_photo_id' })
  product_photo_id: ProductStudio;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) this.id = uuidv4();
  }
}
