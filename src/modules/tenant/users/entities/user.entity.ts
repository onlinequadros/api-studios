import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Address } from '../../address/entities/address.entity';

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

  @Column()
  role: 'Admin' | 'Studio' | 'Fotografo' | 'Artista' | 'Client';

  @Column({ type: String, array: true, nullable: true })
  permissions?: string[];

  @Column({ nullable: true })
  is_active?: boolean;

  @Column({ type: 'enum', enum: ['client', 'system'] })
  user_type?: string;

  @OneToMany(() => Address, (address) => address.user_id, {
    cascade: true,
    nullable: true,
  })
  address?: Address[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) this.id = uuidv4();
  }
}
