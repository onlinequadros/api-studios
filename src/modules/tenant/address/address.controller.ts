import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto, ReadAddressDto } from './dto';

@Controller('address_users')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  async findAll(): Promise<ReadAddressDto[]> {
    return this.addressService.findAll();
  }

  @Post()
  async create(@Body() address: CreateAddressDto): Promise<ReadAddressDto> {
    return this.addressService.create(address);
  }

  @Put('/:id')
  async UpdateAddress(
    @Param('id') id: string,
    @Body() address: CreateAddressDto,
  ): Promise<ReadAddressDto> {
    return this.addressService.updateAddress(id, address);
  }
}
