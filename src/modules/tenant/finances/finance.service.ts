import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Repository } from 'typeorm';
import { TenantProvider } from '../tenant.provider';
import { Orders } from '../orders/entities/orders.entity';
import { WalletsTotalAndDisponible } from './interfaces/wallets';

@Injectable()
export class FinanceService {
  private ordersRepository: Repository<Orders>;

  getOrdersRepository() {
    if (TenantProvider.connection) {
      this.ordersRepository = TenantProvider.connection.getRepository(Orders);
    }
  }

  constructor(
    @InjectRepository(Orders)
    private readonly orders: Repository<Orders>,
  ) {
    this.getOrdersRepository();
  }

  async findValuesOrders(): Promise<WalletsTotalAndDisponible> {
    this.getOrdersRepository();

    const orders = await this.ordersRepository.find({
      relations: ['orders_extra_photos'],
    });

    let sumValueTotalInOrderFinish = 0;
    let sumValueTotalInOrderFinishDisponible = 0;
    orders.map((item) => {
      const countPhotosExtrasSelected = item.orders_extra_photos.length;
      const valuePhotoExtra = item.orders_extra_photos[0].price.replace(
        ',',
        '.',
      );

      // verifica a data pelo tempo de expiração de 30 dias,
      const futureDateExpiration = moment(item.updated_at)
        .add(30, 'days')
        .format('YYYY-MM-DD');
      const today = moment().format('YYYY-MM-DD');

      console.log('future ', futureDateExpiration);
      console.log('today ', today);

      // Pega o valor da foto e multiplica pela quantidade
      const sumPhotoExtra = Number(valuePhotoExtra) * countPhotosExtrasSelected;

      // Se as fotos não teve desconto ela vai pegar somente o valor
      if (item.discount === 0) {
        // Se o valor já estiver com mais de trinta dias ele vai para disponível
        if (futureDateExpiration < today) {
          sumValueTotalInOrderFinishDisponible =
            sumValueTotalInOrderFinishDisponible + sumPhotoExtra;
          return;
        }

        // Se tiver menos de 30 dias soma com os valores das ordens
        sumValueTotalInOrderFinish = sumValueTotalInOrderFinish + sumPhotoExtra;
        return;
      }

      // Se tem desconto ele soma o valor total da order e subtrai pelo desconto
      const generateValueWitchDiscount = sumPhotoExtra - item.discount;
      // Se o valor já estiver com mais de trinta dias ele vai para disponível
      if (futureDateExpiration < today) {
        sumValueTotalInOrderFinishDisponible =
          sumValueTotalInOrderFinishDisponible + generateValueWitchDiscount;
        return;
      }

      sumValueTotalInOrderFinish =
        sumValueTotalInOrderFinish + generateValueWitchDiscount;
      return;
    });

    const objectResponseWallets: WalletsTotalAndDisponible = {
      walletDisponible: sumValueTotalInOrderFinishDisponible,
      walletIndisponible: sumValueTotalInOrderFinish,
    };

    return objectResponseWallets;
  }
}
