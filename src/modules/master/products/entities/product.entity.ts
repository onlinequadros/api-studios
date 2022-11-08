import { Column, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

@Entity('products')
export class Product {
  @PrimaryColumn()
  id: string;

  @Column()
  product_code: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: ['Category1', 'Category2', 'Category3'] })
  category: string;

  @Column()
  reference: string;

  @Column({ type: 'enum', enum: ['Canaleta', 'Caixa', 'Filete'] })
  type: string;

  @Column()
  color: string;

  @Column()
  depth: number;

  @Column()
  height: number;

  @Column()
  width: number;

  @Column()
  guidance: string;

  @Column()
  weight: number;

  @Column()
  background: string;

  @Column()
  sku_father: string;

  @Column()
  paper: string;

  @Column({ type: 'enum', enum: ['vidro', 'sem protecao', 'com protecao'] })
  finishing: string;

  @Column({ type: 'enum', enum: ['linha decoracao'] })
  print_type: string;

  @Column()
  price: number;

  constructor() {
    if (!this.id) this.id = uuidv4();
  }
}
