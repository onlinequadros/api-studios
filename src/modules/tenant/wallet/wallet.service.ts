import {
  BadGatewayException,
  Injectable,
  Scope,
  NotFoundException,
} from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { Orders } from '../orders/entities/orders.entity';
import { TenantProvider } from '../tenant.provider';
import { CreateWalletDto, ReadWalletDto, UpdateWalletDto } from './dtos';
import { Wallet } from './entities/wallet.entity';
import {
  IReadWalletsParams,
  IResponseWalletsData,
} from './interfaces/wallets.interface';

//CADA REQUEST QUE SE CHAMA NA APLICAÇÃO ELA VAI CRIAR UMA NOVA INSTANCIA DESSA CLASSE
@Injectable({ scope: Scope.REQUEST })
export class WalletsProfessionalService {
  private walletProfessionalRepository: Repository<Wallet>;
  private orderRepository: Repository<Orders>;

  getWalletProfessionalRepository() {
    if (TenantProvider.connection) {
      this.walletProfessionalRepository =
        TenantProvider.connection.getRepository(Wallet);
    }
  }

  getOrderRepository() {
    if (TenantProvider.connection) {
      this.orderRepository = TenantProvider.connection.getRepository(Orders);
    }
  }

  constructor() {
    this.getWalletProfessionalRepository();
    this.getOrderRepository();
  }

  // FUNÇÃO PARA BUSCAR TODOS AS WALLETS
  async findAll({
    limit = 10,
    page = 1,
    search = '',
  }: IReadWalletsParams): Promise<IResponseWalletsData> {
    const where = [];

    if (search) {
      where.push({
        payment: search,
      });
    }

    this.getWalletProfessionalRepository();
    const [wallets, count] =
      await this.walletProfessionalRepository.findAndCount({
        where,
        order: {
          created_at: 'DESC',
        },
        take: limit, // aqui pega a quantidade
        skip: (page - 1) * limit,
      });

    return {
      count,
      totalPages: Math.ceil(count / limit),
      data: wallets.map((wallet) => {
        return plainToInstance(ReadWalletDto, wallet);
      }),
    };
  }

  // FUNÇÃO PARA ADICIONAR UM VALOR NA CARTEIRA
  async create(wallet: CreateWalletDto): Promise<ReadWalletDto> {
    this.getWalletProfessionalRepository();

    const orderExists = await this.orderRepository.findOne({
      where: { id: wallet.order_id },
      select: ['id'],
    });

    if (!orderExists) {
      throw new NotFoundException('Ordem de serviço não encontrada');
    }

    try {
      const newWallet = this.walletProfessionalRepository.create(wallet);
      const createWallet = await this.walletProfessionalRepository.save(
        newWallet,
      );

      return plainToClass(ReadWalletDto, createWallet);
    } catch (err) {
      throw new BadGatewayException(err.message);
    }
  }

  // FUNÇÃO PARA ATUALIZAR O ESTADO DA CARTEIRA
  async update(updateWalletDTO: UpdateWalletDto): Promise<ReadWalletDto> {
    this.getWalletProfessionalRepository();
    try {
      const wallet = await this.walletProfessionalRepository.findOne({
        where: { id: updateWalletDTO.id },
      });

      if (!wallet) {
        throw new NotFoundException('Ordem não encontrada para essa carteira.');
      }

      (wallet.status = updateWalletDTO.status),
        (wallet.payment = updateWalletDTO.payment);

      const newWallet = Object.assign(wallet, {
        status: updateWalletDTO.status,
        payment: updateWalletDTO.payment,
      });

      const updateWallet = await this.walletProfessionalRepository.save(
        newWallet,
      );
      return plainToInstance(ReadWalletDto, updateWallet);
    } catch (err) {
      throw new BadGatewayException(err.message);
    }
  }
}
