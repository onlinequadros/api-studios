import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { WalletsProfessionalService } from './wallet.service';
import { IResponseWalletsData } from './interfaces/wallets.interface';
import { CreateWalletDto, ReadWalletDto, UpdateWalletDto } from './dtos';

@Controller('wallets')
export class WalletsProfessionalController {
  constructor(
    private readonly walletProfessionalService: WalletsProfessionalService,
  ) {}

  @Get()
  // @UseGuards(JwtAuthGuard)
  async findAll(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('search') search: string,
  ): Promise<IResponseWalletsData> {
    return this.walletProfessionalService.findAll({ limit, page, search });
  }

  @Post()
  // @UseGuards(JwtAuthGuard)
  async create(@Body() wallet: CreateWalletDto): Promise<ReadWalletDto> {
    return this.walletProfessionalService.create(wallet);
  }

  @Put()
  // @UseGuards(JwtAuthGuard)
  async update(@Body() wallet: UpdateWalletDto): Promise<ReadWalletDto> {
    return this.walletProfessionalService.update(wallet);
  }
}
