import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto, ReadAddressDto } from './dto';

@Controller('address_users')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  async findAll(): Promise<ReadAddressDto[]> {
    return this.addressService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<ReadAddressDto[]> {
    return this.addressService.findAddressInUser(id);
  }

  @Patch('/:id_user')
  async updateFavorite(
    @Param('id_user') id_user: string,
    @Body() idAddress: { select_address: string },
  ): Promise<ReadAddressDto> {
    return this.addressService.updateFavoriteAddress(id_user, idAddress);
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

  @Delete('/:id')
  async DeleteAddress(@Param('id') id: string): Promise<boolean> {
    return this.addressService.deleteAddress(id);
  }
}
