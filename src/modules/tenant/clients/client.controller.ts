import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto, ReadClientDto } from './dto';

@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  async findAll(): Promise<ReadClientDto[]> {
    return this.clientService.findAll();
  }

  @Get('/segment')
  async findSegment(): Promise<{ segment: string }> {
    return this.clientService.findSegment();
  }

  @Post()
  async create(@Body() client: CreateClientDto): Promise<ReadClientDto> {
    return this.clientService.create(client);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() client: CreateClientDto,
  ): Promise<ReadClientDto> {
    return this.clientService.update(id, client);
  }
}
