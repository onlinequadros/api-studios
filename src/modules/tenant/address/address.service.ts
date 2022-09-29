import { Injectable, Scope } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { CreateAddressDto, ReadAddressDto } from './dto';
import { Address } from './entities/address.entity';
import { TenantProvider } from '../tenant.provider';

//CADA REQUEST QUE SE CHAMA NA APLICAÇÃO ELA VAI CRIAR UMA NOVA INSTANCIA DESSA CLASSE
@Injectable({ scope: Scope.REQUEST })
export class AddressService {
  private addressRepository: Repository<Address>;

  constructor() {
    if (TenantProvider.connection) {
      this.addressRepository = TenantProvider.connection.getRepository(Address);
    }
  }

  async findAll(): Promise<ReadAddressDto[]> {
    this.addressRepository = TenantProvider.connection.getRepository(Address);
    const address = await this.addressRepository.find();
    return address.map((addressDto) =>
      plainToInstance(ReadAddressDto, addressDto),
    );
  }

  async create(address: CreateAddressDto): Promise<ReadAddressDto> {
    this.addressRepository = TenantProvider.connection.getRepository(Address);
    const newAdress = this.addressRepository.create(address);
    const createdAddress = await this.addressRepository.save(newAdress);

    return plainToInstance(ReadAddressDto, createdAddress);
  }
}
