import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';
import { OrdersExtraItem } from "./orders-extra-item.entity";
import { OrdersPhotos } from "./ordersPhotos.entity";
import { OrdersExtraPhotos } from "./orders_extra_photos.entity";

@Entity('orders')
export class Orders {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  user_name: string;
  
  @Column()
  receiver_name: string;
  
  @Column()
  cpf: string;
  
  @Column()
  email: string;
  
  @Column()
  phone: string;
  
  @Column()
  product_album_name: string;
  
  @Column()
  amount_extra_photos: number;
  
  @Column()
  amount_photos: number;
  
  @Column({ type: 'enum', enum: ['Credit Card', 'Pix'] })
  payment_type?: string;
  
  @Column()
  installment?: string;
  
  @Column()
  subtotal?: number;
  
  @Column()
  discount?: number;
  
  @Column()
  total_amount?: number;
  
  @Column()
  notes?: string;
  
  @Column()
  salesman?: string;
  
  @Column()
  shipping_address?: string;
  
  @Column()
  shipping_method?: string;
  
  @Column()
  delivery_deadline?: string;
  
  @Column()
  shipping_value?: number;
  
  @Column()
  external_transaction_id?: string;
  
  @Column()
  status?: 'APPROVED' | 'RECUSED';
  
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  deleted_at?: Date;

  @OneToMany(() => OrdersExtraItem, (orderExtraItem) => orderExtraItem.order_id, {
      cascade: true,
      nullable: true,
    },
  ) 
  orders_extra_items: OrdersExtraItem[]; 

  @OneToMany(() => OrdersExtraPhotos, (orderExtraPhotos) => orderExtraPhotos.order_id, {
    cascade: true,
    nullable: true,
  },
) 
  orders_extra_photos: OrdersExtraPhotos[]; 

  @OneToMany(() => OrdersPhotos, (orderPhotos) => orderPhotos.order_id, {
    cascade: true,
    nullable: true
  },
) 
  orders_photos: OrdersPhotos[]; 

  constructor() {
    if (!this.id) this.id = uuidv4();
  }
}