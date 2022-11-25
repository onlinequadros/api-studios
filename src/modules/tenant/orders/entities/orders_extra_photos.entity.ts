import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Orders } from './orders.entity';

@Entity('orders_extra_photos')
export class OrdersExtraPhotos {
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

  @ManyToOne(() => Orders, (order) => order.orders_extra_photo, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete'
  })
  order_id?: Orders;

  constructor() {
    if (!this.id) this.id = uuidv4();
  }
}
