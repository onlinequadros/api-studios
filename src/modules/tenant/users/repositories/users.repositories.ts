import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TenantProvider } from '../../tenant.provider';
import { User } from '../entities/user.entity';

@Injectable()
export class UserDinamicRepository {
  private repository: Repository<User>;

  getUserRepository() {
    if (TenantProvider.connection) {
      this.repository = TenantProvider.connection.getRepository(User);
    }
  }

  constructor() {
    this.getUserRepository();
  }

  async findOne(id: string): Promise<User> {
    this.getUserRepository();
    return await this.repository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User> {
    this.getUserRepository();
    return await this.repository.findOne({ where: { email } });
  }

  async findByCPF(cpf: string): Promise<User> {
    this.getUserRepository();
    return await this.repository.findOne({ where: { cpf } });
  }
}
