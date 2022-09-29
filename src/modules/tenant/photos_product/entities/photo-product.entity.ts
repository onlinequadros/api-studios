import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Product } from '../../products/entities/product.entity';

// ENTIDADE PARA OS DADOS DE UM ARTISTA
@Entity('photoproduct')
export class PhotoProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  photo: string;

  @Column()
  price: string;

  @Column()
  sku: string;

  @Column({ nullable: true })
  feature_photo?: boolean;

  @OneToOne(() => Product, (product) => product.product_artistic)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) this.id = uuidv4();
  }
}
