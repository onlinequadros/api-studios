import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('profit')
export class ProfitPercentage {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.0 })
  photographer_commission: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.0 })
  owner_commission: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) this.id = uuidv4();
  }
}
