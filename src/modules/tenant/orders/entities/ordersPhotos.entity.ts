import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Orders } from '../../orders/entities/orders.entity';

@Entity('orders_photos')
export class OrdersPhotos {
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

  @ManyToOne(() => Orders, (order) => order.orders_photos, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  order_id?: Orders;

  constructor() {
    if (!this.id) this.id = uuidv4();
  }
}
