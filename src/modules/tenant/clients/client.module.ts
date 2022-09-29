import { Module, forwardRef } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { CompaniesModule } from 'src/modules/master/companies/companies.module';
import { ClientRepository } from './repository/client.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client]),
    forwardRef(() => CompaniesModule),
  ],
  controllers: [ClientController],
  providers: [ClientService, ClientRepository],
  exports: [ClientService, ClientRepository],
})
export class ClientModule {}
