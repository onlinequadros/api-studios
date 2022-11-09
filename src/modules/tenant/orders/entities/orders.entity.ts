import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

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
  
  @Column()
  items: string;
  
  @Column({ type: 'enum', enum: ['Credit Card', 'Pix'] })
  payment_type: string;
  
  @Column()
  installment: string;
  
  @Column()
  subtotal: number;
  
  @Column()
  discount: number;
  
  @Column()
  total_amount: number;
  
  @Column()
  notes: string;
  
  @Column()
  salesman: string;
  
  @Column()
  shipping_address: string;
  
  @Column()
  shipping_method: string;
  
  @Column()
  delivery_deadline: string;
  
  @Column()
  shipping_value: number;
  
  @Column()
  external_transaction_id: string;
  
  @Column()
  status: 'APPROVED' | 'RECUSED';
  
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  deleted_at?: Date;

  constructor() {
    if (!this.id) this.id = uuidv4();
  }
}