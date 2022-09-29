import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import { CreateClientDto, ReadClientDto } from './dto';
import { Client } from './entities/client.entity';
import { TenantProvider } from '../tenant.provider';
import { ClientRepository } from './repository/client.repository';

//CADA REQUEST QUE SE CHAMA NA APLICAÇÃO ELA VAI CRIAR UMA NOVA INSTANCIA DESSA CLASSE
@Injectable({ scope: Scope.REQUEST })
export class ClientService {
  private clientConnectionRepository: Repository<Client>;

  getConnectionClient = () => {
    if (TenantProvider.connection) {
      this.clientConnectionRepository =
        TenantProvider.connection.getRepository(Client);
    }
  };

  constructor(private readonly clientRepository: ClientRepository) {}

  async findAll(): Promise<ReadClientDto[]> {
    this.getConnectionClient();
    const clients = await this.clientConnectionRepository.find();
    return clients.map((client) => {
      delete client.password;
      return plainToClass(ReadClientDto, client);
    });
  }

  async create(client: CreateClientDto): Promise<ReadClientDto> {
    this.getConnectionClient();
    const createdUser = await this.clientConnectionRepository.save(client);

    return plainToClass(ReadClientDto, createdUser);
  }

  async update(id: string, client: CreateClientDto): Promise<ReadClientDto> {
    this.getConnectionClient();

    const clientExists = await this.clientRepository.fincClient(id);

    if (!clientExists) {
      throw new NotFoundException('Client não encontrado');
    }

    const objectClientUpdate = Object.assign(clientExists, client);

    const createdUser = await this.clientConnectionRepository.save(
      objectClientUpdate,
    );

    return plainToClass(ReadClientDto, createdUser);
  }
}
