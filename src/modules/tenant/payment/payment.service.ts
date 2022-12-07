import { HttpException, Injectable, Logger } from '@nestjs/common';
import { PsCreditCardDTO } from './dto/ps_creditCard.dto';
import { PsPixDTO } from './dto/ps_pix.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import * as moment from 'moment';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  constructor(private readonly httpService: HttpService) {}

  async pagSeguroCreditCard(psCreditCardDTO: PsCreditCardDTO) {
    const { user, item, address, purchase, card } = psCreditCardDTO;

    const creditCardData = {
      reference_id: 'OQ-00001',
      customer: {
        name: user.name,
        email: user.email,
        tax_id: user.cpf_or_cpnj,
      },
      items: [
        {
          reference_id: '123456789',
          name: item.name,
          quantity: item.quantity,
          unit_amount: item.unit_amount,
        },
      ],
      qr_codes: [
        {
          amount: {
            value: purchase.amount,
          },
        },
      ],
      shipping: {
        address: {
          street: address.street,
          number: address.number,
          complement: address.complement,
          locality: address.locality,
          city: address.city,
          region_code: address.regionCode,
          country: address.country,
          postal_code: address.postalCode,
        },
      },
      notification_urls: ['string'],
      charges: [
        {
          reference_id: '00001',
          description: purchase.purchaseDescription,
          amount: {
            value: purchase.amount,
            currency: 'BRL',
          },
          payment_method: {
            type: 'CREDIT_CARD',
            installments: card.installments,
            capture: true,
            card: {
              number: card.number,
              exp_month: card.expMonth,
              exp_year: card.expYear,
              security_code: card.securityCode,
              holder: {
                name: user.name,
              },
              store: false,
            },
          },
          notification_urls: ['string'],
        },
      ],
    };

    try {
      const purchase = await lastValueFrom(
        this.httpService
          .post(process.env.FAST_PAG_CREDIT_CARD_URL, creditCardData)
          .pipe(map((response) => response.data)),
      );

      return purchase;
    } catch (error) {
      this.logger.error(
        error.stack,
        'Falha no pagamento via cartão de crédito',
      );
      throw new HttpException('Falha no pagamento via cartão de crédito', 400);
    }
  }

  async pagSeguroPix(psPixDTO: PsPixDTO) {
    const { user, purchase } = psPixDTO;
    const now = moment();
    const expiresDate = now.add(2, 'hour');

    const pixData = {
      reference_id: '00001',
      customer: {
        name: user.name,
        email: user.email,
        tax_id: user.cpf_or_cpnj,
      },
      qr_codes: [
        {
          amount: {
            value: purchase.value,
          },
          expiration_date: expiresDate,
        },
      ],
      notification_urls: ['string'],
    };

    try {
      const purchase = await lastValueFrom(
        this.httpService
          .post(process.env.FAST_PAG_PIX_URL, pixData)
          .pipe(map((response) => response.data)),
      );

      return purchase;
    } catch (error) {
      this.logger.error(error.stack, 'Falha no pagamento via pix');
      throw new HttpException('Falha no pagamento via pix', 400);
    }
  }
}
