import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import { CreateClientDto, ReadClientDto } from './dto';
import { Client } from './entities/client.entity';
import { TenantProvider } from '../tenant.provider';
import { ClientRepository } from './repository/client.repository';
import { UpdateClientDTO } from './dto/updateClient.dto';

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

  // RETORNA TODAS AS INFORMAÇÕES DO CLIENT
  async findAll(): Promise<ReadClientDto[]> {
    this.getConnectionClient();
    const clients = await this.clientConnectionRepository.find();
    return clients.map((client) => {
      delete client.password;
      return plainToClass(ReadClientDto, client);
    });
  }

  // FAZ O GET NA TABELA RETORNANDO SOMENTE O SEGMENT
  async findSegment(): Promise<{ segment: string }> {
    this.getConnectionClient();
    const clients = await this.clientConnectionRepository.find();
    return { segment: clients?.[0].segment };
  }

  // CRIA UM CLIENT
  async create(client: CreateClientDto): Promise<ReadClientDto> {
    this.getConnectionClient();
    const createdUser = await this.clientConnectionRepository.save(client);

    return plainToClass(ReadClientDto, createdUser);
  }

  // ATUALIZA UM CLIENT
  async update(id: string, updateClientDTO: UpdateClientDTO): Promise<ReadClientDto> {
    this.getConnectionClient();

    const clientExists = await this.clientRepository.fincClient(id);

    if (!clientExists) {
      throw new NotFoundException('Client não encontrado');
    }

    const objectClientUpdate = Object.assign(clientExists, updateClientDTO);

    const createdUser = await this.clientConnectionRepository.save(
      objectClientUpdate,
    );

    return plainToClass(ReadClientDto, createdUser);
  }
}
