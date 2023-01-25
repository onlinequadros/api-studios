import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from 'src/modules/master/companies/dto/create-company.dto';
import { Connection } from 'typeorm';
import { DatabaseProvider } from '../shared/database/database.provider';
import { Client } from './clients/entities/client.entity';
import { User } from './users/entities/user.entity';
import { v4 as uuidV4 } from 'uuid';
import { Category } from './categories/entities/category.entity';
import { categories } from './categories/seeder/categories.seed';

interface ITenantUserService {
  id: string;
  name: string;
  lastname: string;
  cpf: string;
  email: string;
  phone: string;
  sex: 'Masculino' | 'Feminino';
  birth_date: string;
  password: string;
  role: 'Admin' | 'Studio' | 'Fotografo' | 'Artista';
  permissions: string[];
  is_active: boolean;
  user_type: 'client' | 'system';
}

@Injectable()
export class TenantService {
  private connection: Connection;

  constructor(private readonly databaseProvider: DatabaseProvider) {}

  async createTenant(tenant: string, clientDto: CreateCompanyDto) {
    if (!this?.connection?.isConnected)
      this.connection = await this.databaseProvider.getConnection(
        process.env.CMS_POSTGRES_DB_NAME,
      );
    const databaseExists = await this.connection.query(
      `SELECT datname FROM pg_database WHERE datname = '${tenant}'`,
    );

    if (!databaseExists.length) {
      await this.connection.query(`CREATE DATABASE ${tenant}`);
    }

    let tenantConnection = await this.databaseProvider.getConnection(
      tenant,
      true,
      true,
    );
    await tenantConnection.close();

    tenantConnection = await this.databaseProvider.getConnection(
      tenant,
      true,
      // true,
    );

    const clientRepository = tenantConnection.getRepository(Client);
    const userRepositorory = tenantConnection.getRepository(User);
    const categoriesRepository = tenantConnection.getRepository(Category);

    const userTenant: ITenantUserService = {
      id: uuidV4(),
      name: clientDto.name,
      lastname: clientDto.lastname,
      cpf: clientDto.cpf,
      email: clientDto.email,
      phone: clientDto.phone,
      sex: clientDto.sex,
      birth_date: clientDto.birth_date,
      password: clientDto.password,
      role: clientDto.role,
      permissions: ['create', 'head', 'update', 'delete'],
      is_active: true,
      user_type: 'system',
    };

    const client = await clientRepository.save(clientDto);
    await userRepositorory.save(userTenant);

    categories.forEach(async (category) => {
      await categoriesRepository.save(category);
    });

    await this.connection.close();

    return client;
  }
}
