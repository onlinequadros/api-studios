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

  @Column()
  number_order: number;

  @Column()
  name_client: string;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0.0 })
  percentage_studio: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0.0 })
  percentage_photograph: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0.0 })
  value_total_product_fisic: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0.0 })
  value_total_photo_extra: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0.0 })
  commission_studio_in_photo: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0.0 })
  commission_photograph_in_frame: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0.0 })
  value_total_frame_with_discount: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0.0 })
  value_total_photograph_with_discount: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0.0 })
  value_total_photograph_with_frame: number;

  @Column({
    type: 'enum',
    enum: ['APPROVED', 'ACCOMPLISHED', 'BLOCKED', 'AWAITRELEASE'],
  })
  payment: string;

  @Column()
  withdraw_visible: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) this.id = uuidv4();
  }
}
