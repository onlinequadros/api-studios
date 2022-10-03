import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('companies')
export class Company {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  lastname: string;

  @Column()
  cpf: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  sex: 'Masculino' | 'Feminino';

  @Column()
  birth_date: string;

  @Column({ nullable: true })
  cnpj?: string;

  @Column({ nullable: true })
  company_name?: string;

  @Column({ nullable: true })
  message_email?: string;

  @Column()
  address: string;

  @Column()
  number: string;

  @Column()
  district: string;

  @Column()
  city: string;

  @Column()
  uf: string;

  @Column()
  cep: string;

  @Column({ nullable: true })
  complement?: string;

  @Column({ type: 'enum', enum: ['Studio', 'Artista'] })
  segment: string;

  @Column()
  password: string;

  @Column()
  login_notification: boolean;

  @Column({ nullable: true })
  code_access?: string;

  @Column({ nullable: true })
  validate_access?: boolean;

  @Column({ unique: true })
  tenant_company: string;

  @Column()
  role: 'Admin' | 'Studio' | 'Fotografo' | 'Artista';

  @Column({ nullable: true })
  status?: string;

  @Column({ nullable: true })
  plan_recurrence?: string;

  @Column({ nullable: true })
  plan_id?: string;

  @Column({ nullable: true })
  is_active?: string;

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
