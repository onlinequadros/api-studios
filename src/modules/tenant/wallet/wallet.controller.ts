import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WalletsProfessionalService } from './wallet.service';
import { IResponseWalletsData } from './interfaces/wallets.interface';
import { CreateWalletDto, ReadWalletDto, UpdateWalletDto } from './dtos';

@Controller('wallets')
export class WalletsProfessionalController {
  constructor(
    private readonly walletProfessionalService: WalletsProfessionalService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('search') search: string,
  ): Promise<IResponseWalletsData> {
    return this.walletProfessionalService.findAll({ limit, page, search });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() wallet: CreateWalletDto): Promise<ReadWalletDto> {
    return this.walletProfessionalService.create(wallet);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async update(@Body() wallet: UpdateWalletDto): Promise<ReadWalletDto> {
    return this.walletProfessionalService.update(wallet);
  }

  @Patch('/payment')
  @UseGuards(JwtAuthGuard)
  async pathPayment(@Body() wallet: UpdateWalletDto): Promise<ReadWalletDto> {
    return this.walletProfessionalService.pathPayment(wallet);
  }
}
