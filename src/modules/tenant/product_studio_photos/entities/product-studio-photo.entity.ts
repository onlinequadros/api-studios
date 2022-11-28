import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ProductStudio } from '../../product_studio/entity/product-studio.entity';

@Entity('productstudiophotos')
export class ProductStudioPhoto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  photo: string;

  @Column({ nullable: true })
  feature_photo?: boolean;

  @Column()
  url: string;

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
