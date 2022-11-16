import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClientService } from './client.service';
import { CreateClientDto, ReadClientDto } from './dto';
import { UpdateClientDTO } from './dto/updateClient.dto';

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

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateClientDTO: UpdateClientDTO,
  ): Promise<ReadClientDto> {
    return this.clientService.update(id, updateClientDTO);
  }

  @Post('upload-cover')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file,
    @Query('id') id: string,
  ): Promise<{ url: string }> {
    return await this.clientService.uploadCover(file, id);
  }
}
