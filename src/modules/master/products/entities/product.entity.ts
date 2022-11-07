import { Column, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

@Entity('products')
export class Product {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'enum', enum: ['Quadros', 'Comum'] })
  type: string;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column()
  sku_father: string;

  constructor() {
    if (!this.id) this.id = uuidv4();
  }
}
