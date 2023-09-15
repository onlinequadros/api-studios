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
import { UpdateWalletWitdrawDto } from './dtos/update-wallet-witdraw.dto';

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
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<IResponseWalletsData> {
    return this.walletProfessionalService.findAll({
      limit,
      page,
      search,
      from,
      to,
    });
  }

  @Get('/admin')
  // @UseGuards(JwtAuthGuard)
  async adminFindAll(
    @Query('limit') limit: number,
    @Query('page') page: number,
  ): Promise<IResponseWalletsData> {
    return this.walletProfessionalService.adminFindAll({ limit, page });
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
  async pathPayment(
    @Body() wallet: UpdateWalletWitdrawDto,
  ): Promise<ReadWalletDto> {
    return this.walletProfessionalService.pathPayment(wallet);
  }

  @Patch('/confirm-accept')
  // @UseGuards(JwtAuthGuard)
  async pathConfirmAccept(
    @Body() wallet: UpdateWalletDto,
  ): Promise<ReadWalletDto> {
    return this.walletProfessionalService.pathConfirmAccept(wallet);
  }

  @Patch('/finish-payment')
  // @UseGuards(JwtAuthGuard)
  async admFinishPayment(
    @Body() wallet: UpdateWalletDto,
  ): Promise<ReadWalletDto> {
    return this.walletProfessionalService.admFinishPayment(wallet);
  }
}
