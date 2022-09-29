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
import { User } from '../../users/entities/user.entity';

@Entity('address')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  address_name: string;

  @Column()
  number: string;

  @Column()
  district: string;

  @Column()
  city: string;

  @Column()
  uf: string;

  @Column()
  cep: string;

  @Column()
  complement: string;

  @Column()
  favorite: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user_id: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) this.id = uuidv4();
  }
}
