import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Address } from '../../address/entities/address.entity';
import { ProductStudio } from '../../product_studio/entity/product-studio.entity';

@Entity('users')
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  lastname: string;

  @Column()
  cpf: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  sex: 'Masculino' | 'Feminino';

  @Column()
  birth_date: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  slug?: string;

  @Column({ nullable: true })
  forgot_password?: string;

  @Column()
  role: 'Admin' | 'Studio' | 'Fotografo' | 'Artista' | 'Client';

  @Column({ type: String, array: true, nullable: true })
  permissions?: string[];

  @Column({ nullable: true })
  is_active?: boolean;

  @Column({ type: 'enum', enum: ['client', 'system', 'guest'] })
  user_type?: 'client' | 'system' | 'guest';

  @OneToMany(() => Address, (address) => address.user_id, {
    cascade: true,
    nullable: true,
  })
  address?: Address[];

  @ManyToMany(() => ProductStudio, (product) => product.users)
  products?: ProductStudio[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) this.id = uuidv4();
  }
}
