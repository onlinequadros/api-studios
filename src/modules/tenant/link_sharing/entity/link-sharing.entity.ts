import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('linksharing')
export class LinkSharing {
  @PrimaryColumn()
  id: string;

  @Column()
  studio: string;

  @Column()
  slug: string;

  @Column()
  code: string;

  @Column()
  link: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  delete_at: Date;

  constructor() {
    if (!this.id) this.id = uuidv4();
  }
}
