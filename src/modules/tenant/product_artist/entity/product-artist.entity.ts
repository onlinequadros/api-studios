import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('productartist')
export class ProductArtist {
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

  @Column({ nullable: true })
  photo?: string;

  @Column()
  price: string;

  @Column()
  feature_photo: boolean;

  @Column({ nullable: true })
  url?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) this.id = uuidv4();
  }
}
