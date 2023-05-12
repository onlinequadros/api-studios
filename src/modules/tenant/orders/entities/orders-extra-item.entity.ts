import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Orders } from './orders.entity';

@Entity('orders_extra_items')
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
  price: string;

  @Column()
  url_image: string;

  @Column({ nullable: true })
  quantity?: number;

  @Column({ nullable: true })
  image_dimension_frame?: string;

  @Column()
  url_cropped?: string;

  @Column()
  type: string;

  @ManyToOne(() => Orders, (order) => order.orders_extra_items, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  order_id?: Orders;

  constructor() {
    if (!this.id) this.id = uuidv4();
  }
}
