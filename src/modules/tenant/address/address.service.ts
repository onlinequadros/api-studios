import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { validate as uuidValidate } from 'uuid';
import { CreateAddressDto, ReadAddressDto } from './dto';
import { Address } from './entities/address.entity';
import { TenantProvider } from '../tenant.provider';

//CADA REQUEST QUE SE CHAMA NA APLICAÇÃO ELA VAI CRIAR UMA NOVA INSTANCIA DESSA CLASSE
@Injectable({ scope: Scope.REQUEST })
export class AddressService {
  private addressRepository: Repository<Address>;

  getUserRepository() {
    if (TenantProvider.connection) {
      this.addressRepository = TenantProvider.connection.getRepository(Address);
    }
  }

  constructor() {
    this.getUserRepository();
  }

  async findAll(): Promise<ReadAddressDto[]> {
    this.getUserRepository();
    const address = await this.addressRepository.find({
      order: { created_at: 'ASC' },
    });
    return address.map((addressDto) =>
      plainToInstance(ReadAddressDto, addressDto),
    );
  }

  async findAddressInUser(id: string): Promise<ReadAddressDto[]> {
    this.getUserRepository();
    const address = await this.addressRepository.find({
      where: { user_id: id },
    });

    if (!address) {
      throw new NotFoundException('Cadastre o seu endereço para continuar.');
    }

    return plainToInstance(ReadAddressDto, address);
  }

  async updateFavoriteAddress(
    id_user: string,
    idAddress: { select_address: string },
  ): Promise<ReadAddressDto> {
    this.getUserRepository();

    const allAddress = await this.addressRepository.find({
      where: { user_id: id_user },
    });

    const objAddress = allAddress.map(async (item) => {
      if (item.favorite === true) {
        item.favorite = false;
        await this.addressRepository.save(item);
      }
      return item;
    });

    if (objAddress && objAddress.length) {
      const address = await this.addressRepository.findOne({
        where: {
          id: idAddress.select_address,
        },
      });
      address.favorite = true;
      const updateAddress = await this.addressRepository.save(address);

      return plainToInstance(ReadAddressDto, updateAddress);
    }
  }

  async create(address: CreateAddressDto): Promise<ReadAddressDto> {
    this.getUserRepository();
    const newAdress = this.addressRepository.create(address);
    const createdAddress = await this.addressRepository.save(newAdress);

    return plainToInstance(ReadAddressDto, createdAddress);
  }

  async updateAddress(
    address_id: string,
    address: CreateAddressDto,
  ): Promise<ReadAddressDto> {
    this.getUserRepository();

    if (!uuidValidate(address_id)) {
      throw new BadRequestException('Id informado não é válido.');
    }

    const addressExists = await this.addressRepository.findOne({
      where: { user_id: address_id },
    });

    if (!addressExists) {
      throw new NotFoundException('Identificador do endereço não encontrado');
    }

    const newAddress = Object.assign(addressExists, address);
    const createdAddress = await this.addressRepository.save(newAddress);

    return plainToInstance(ReadAddressDto, createdAddress);
  }

  async deleteAddress(address_id: string): Promise<boolean> {
    this.getUserRepository();

    if (!uuidValidate(address_id)) {
      throw new BadRequestException('Id informado não é válido.');
    }

    const addressExists = await this.addressRepository.findOne({
      where: { id: address_id },
    });

    if (!addressExists) {
      throw new NotFoundException('Identificador do endereço não encontrado');
    }

    if (addressExists.favorite === true) {
      throw new BadRequestException(
        'Escolha outro endereço ou adicione um novo para deixar como favorito antes de remover.',
      );
    }

    try {
      await this.addressRepository.delete(addressExists.id);

      return true;
    } catch (err) {
      return false;
    }
  }
}
