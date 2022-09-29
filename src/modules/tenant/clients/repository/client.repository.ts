import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TenantProvider } from '../../tenant.provider';
import { Client } from '../entities/client.entity';

@Injectable()
export class ClientRepository {
  private repository: Repository<Client>;

  getClientRepository() {
    if (TenantProvider.connection) {
      this.repository = TenantProvider.connection.getRepository(Client);
    }
  }

  constructor() {
    this.getClientRepository();
  }

  async fincClient(id: string): Promise<Client> {
    this.getClientRepository();
    return await this.repository.findOne({ where: { id } });
  }
}
