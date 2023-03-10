import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  order_id: string;

  @Column()
  product_id: string;

  @Column({ type: 'enum', enum: ['INVALID', 'BLOCKED', 'DISPONIBLE'] })
  status: string;

  @Column()
  value: string;

  @Column({ type: 'enum', enum: ['ACCOMPLISHED', 'BLOCKED', 'AWAITRELEASE'] })
  payment: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) this.id = uuidv4();
  }
}
