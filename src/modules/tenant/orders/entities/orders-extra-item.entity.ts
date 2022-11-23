import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Orders } from './orders.entity';

@Entity('orders_extra_item')
export class OrdersExtraItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  product_id: string;

  @Column()
  sku: string;

  @Column()
  product_name: string;

  @Column()
  category: string;

  @Column()
  price: number;

  @Column()
  image_cropped: string;

  @ManyToOne(() => Orders)
  @JoinColumn({ name: 'order_id' })
  order_id?: Orders;

  constructor() {
    if (!this.id) this.id = uuidv4();
  }
}
