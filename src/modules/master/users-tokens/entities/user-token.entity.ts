import { Company } from '../../companies/entities/company.entity';
import { v4 as uuidv4 } from 'uuid';

import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity('users_tokens')
export class UserToken {
  @PrimaryColumn()
  id: string;

  @Column()
  expires_date: Date;

  @Column()
  refresh_token: string;

  @Column()
  user_id: string;

  @OneToOne(() => Company)
  @JoinColumn({ name: 'user_id' })
  user: Company;

  constructor() {
    if (!this.id) this.id = uuidv4();
  }
}
