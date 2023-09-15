import {
  BadGatewayException,
  Injectable,
  Scope,
  NotFoundException,
} from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import * as moment from 'moment';
import { resolve } from 'path';
import { Between, Repository } from 'typeorm';
import { Client } from '../clients/entities/client.entity';
import { MailsStudioService } from '../mails/mail-studio.service';
import { Orders } from '../orders/entities/orders.entity';
import { TenantProvider } from '../tenant.provider';
import { CreateWalletDto, ReadWalletDto, UpdateWalletDto } from './dtos';
import { Wallet } from './entities/wallet.entity';
import {
  IReadWalletsParams,
  IResponseWalletsData,
} from './interfaces/wallets.interface';
import { formatedDateYearMontDay } from 'src/modules/utils/formatedDate';
import { UpdateWalletWitdrawDto } from './dtos/update-wallet-witdraw.dto';

//CADA REQUEST QUE SE CHAMA NA APLICAÇÃO ELA VAI CRIAR UMA NOVA INSTANCIA DESSA CLASSE
@Injectable({ scope: Scope.REQUEST })
export class WalletsProfessionalService {
  private walletProfessionalRepository: Repository<Wallet>;
  private orderRepository: Repository<Orders>;
  private clientRepository: Repository<Client>;

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

  getClientRepository() {
    if (TenantProvider.connection) {
      this.clientRepository = TenantProvider.connection.getRepository(Client);
    }
  }

  constructor(private readonly mailsService: MailsStudioService) {
    this.getWalletProfessionalRepository();
    this.getOrderRepository();
    this.getClientRepository();
  }

  // FUNÇÃO PARA BUSCAR TODOS AS WALLETS
  async findAll({
    limit = 10,
    page = 1,
    search = '',
    from,
    to,
  }: IReadWalletsParams): Promise<IResponseWalletsData> {
    const where = [];
    const dateFormated = formatedDateYearMontDay(new Date(), true);

    if (search) {
      where.push({
        status: search,
      });
    }

    if (from || to) {
      // nesse to está adicionando um dia na data
      const toDateActual = to
        ? formatedDateYearMontDay(to, true)
        : dateFormated;
      where.push({
        created_at: Between(from, toDateActual),
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

  // FUNÇÃO PARA BUSCAR TODOS AS WALLETS ADMIN
  async adminFindAll({
    limit = 10,
    page = 1,
  }: IReadWalletsParams): Promise<IResponseWalletsData> {
    const where = [{ payment: 'AWAITRELEASE' }, { payment: 'ACCOMPLISHED' }];

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

  // FUNÇÃO PARA SOLICITAR UM SAQUE NO ESTADO DA CARTEIRA
  async pathPayment(
    updateWalletDTO: UpdateWalletWitdrawDto,
  ): Promise<ReadWalletDto> {
    this.getWalletProfessionalRepository();

    try {
      const wallet = await this.walletProfessionalRepository.findOne({
        where: { id: updateWalletDTO.id },
      });

      if (!wallet) {
        throw new NotFoundException('Ordem não encontrada para essa carteira.');
      }

      wallet.payment = updateWalletDTO.payment;

      const client = await this.clientRepository.find({
        select: ['id', 'name', 'lastname', 'tenant_company'],
      });

      const templatePath = resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'views',
        'emails',
        'withdraw-payment.hbs',
      );

      const nameClient = `${client[0].name.toUpperCase()} ${client[0].lastname.toUpperCase()}`;

      const variables = {
        name: nameClient,
        date: moment().format('DD/MM/YYYY'),
        studio: client[0].tenant_company.toUpperCase(),
      };

      await this.mailsService.sendEmail(
        process.env.ADM_EMAIL_FINANCES,
        'Solicitação de saque',
        variables,
        templatePath,
      );

      const newWallet = Object.assign(wallet, {
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

  // FUNÇÃO PARA ATUALIZAR O ESTADO DA CARTEIRA
  async pathConfirmAccept(
    updateWalletDTO: UpdateWalletDto,
  ): Promise<ReadWalletDto> {
    this.getWalletProfessionalRepository();
    try {
      const wallet = await this.walletProfessionalRepository.findOne({
        where: { id: updateWalletDTO.id },
      });

      if (!wallet) {
        throw new NotFoundException('Ordem não encontrada para essa carteira.');
      }

      const newWallet = Object.assign(wallet, {
        withdraw_visible: true,
      });

      const updateWallet = await this.walletProfessionalRepository.save(
        newWallet,
      );
      return plainToInstance(ReadWalletDto, updateWallet);
    } catch (err) {
      throw new BadGatewayException(err.message);
    }
  }

  // FUNÇÃO PARA O ADMINISTRADOR FINALIZAR O PAGAMENTO
  async admFinishPayment(
    updateWalletDTO: UpdateWalletDto,
  ): Promise<ReadWalletDto> {
    this.getWalletProfessionalRepository();
    try {
      const wallet = await this.walletProfessionalRepository.findOne({
        where: { id: updateWalletDTO.id },
      });

      if (!wallet) {
        throw new NotFoundException('Ordem não encontrada para essa carteira.');
      }

      const newWallet = Object.assign(wallet, {
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
