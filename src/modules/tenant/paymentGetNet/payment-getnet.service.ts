import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { getNetCreditCardDTO } from './dto/creditCard.dto';
import { IResponsePaymentFirstStep } from './types/response-payment-first-step.type';
import { getNetCreditPixDTO } from './dto/credicPix.dto';

@Injectable()
export class PaymentGetNetService {
  constructor(private readonly httpService: HttpService) {}

  // FUNÇÃO PARA PEGAR A PRIMEIRA PARTE DO PAGAMENTO, ELA PEGA O BEARER DE AUTORIZAÇÃO
  async paymentAuth() {
    try {
      const authorization = Buffer.from(
        process.env.GETNET_AUTHORIZATION,
      ).toString('base64');

      const headersConfig = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json, text/plain',
          Authorization: `Basic ${authorization}`,
        },
      };

      const responseData = {
        scope: 'oob',
        grant_type: 'client_credentials',
      };

      const responseDataKey = await lastValueFrom(
        this.httpService
          .post(
            `${process.env.GETNET_URL_API}/auth/oauth/v2/token`,
            responseData,
            headersConfig,
          )
          .pipe(map((response) => response.data)),
      );

      return responseDataKey;
    } catch (err) {
      throw new BadRequestException(
        'Falha no processo de gerar a chave para pagamento',
      );
    }
  }

  // SEGUNDA PARTE DA FUNÇÃO DE PAGAMENTO, ELA RETORNA O TOKEN DE VALIDAÇÃO DO CARTÃO
  async paymentGenerateToken(cardNumber: string, authorization: string) {
    try {
      const headersConfig = {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/plain',
          Authorization: `Bearer ${authorization}`,
        },
      };

      const responseData = {
        card_number: cardNumber,
      };

      const responseTokenCard = await lastValueFrom(
        this.httpService
          .post(
            `${process.env.GETNET_URL_API}/v1/tokens/card`,
            responseData,
            headersConfig,
          )
          .pipe(map((response) => response.data)),
      );

      return { responseTokenCard, authorization };
    } catch (err) {
      throw new BadRequestException('Erro ao gerar um token para o pagamento');
    }
  }

  // FUNÇÃO PARA REALIZAR O PAGAMENTO EM CARTÃO DE CRÉDITO
  async paymentCreditCardGetNet(paymentCreditCardDTO: getNetCreditCardDTO) {
    const {
      amount,
      card_number,
      cardholder_name,
      customer,
      expiration_month,
      order,
      expiration_year,
    } = paymentCreditCardDTO;

    const proccessPaymentFirstStep: IResponsePaymentFirstStep =
      await this.paymentAuth();

    const proccessVerifyCardPayment = await this.paymentGenerateToken(
      card_number,
      proccessPaymentFirstStep.access_token,
    );

    const requestData = {
      seller_id: process.env.GETNET_SELLER_ID,
      amount: amount,
      order: {
        order_id: order.order_id,
      },
      customer: {
        customer_id: customer.customer_id,
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email,
        document_type: 'CPF',
        document_number: customer.document_number,
        phone_number: `55${customer.phone_number}`,
        billing_address: {
          street: customer.billing_address.street,
          number: customer.billing_address.number,
          city: customer.billing_address.city,
          state: customer.billing_address.state,
          postal_code: customer.billing_address.postal_code,
        },
      },
      device: {},
      shippings: [
        {
          address: {},
        },
      ],
      sub_merchant: {},
      credit: {
        delayed: false,
        save_card_data: false,
        transaction_type: 'FULL',
        number_installments: 1,
        card: {
          number_token:
            proccessVerifyCardPayment.responseTokenCard.number_token,
          cardholder_name: cardholder_name,
          expiration_month: expiration_month,
          expiration_year: expiration_year,
        },
      },
    };

    if (proccessVerifyCardPayment) {
      try {
        const headersConfig = {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json, text/plain',
            Authorization: `Bearer ${proccessVerifyCardPayment.authorization}`,
          },
        };

        const responsePaymentCredit = await lastValueFrom(
          this.httpService
            .post(
              `${process.env.GETNET_URL_API}/v1/payments/credit`,
              requestData,
              headersConfig,
            )
            .pipe(map((response) => response.data)),
        );

        return responsePaymentCredit;
      } catch (err) {
        throw new BadRequestException('Erro no pagamento', {
          cause: new Error(),
          description: 'Falha ao realizar o pagamento no cartão',
        });
      }
    }
  }

  // FUNÇÃO PARA GERAR O QRCODE PARA FAZER O PAGAMENTO EM PIX
  async paymentCreditPixGetNet(paymentCreditPixDto: getNetCreditPixDTO) {
    const { amount, customer_id, order_id } = paymentCreditPixDto;

    const proccessPaymentFirstStep: IResponsePaymentFirstStep =
      await this.paymentAuth();

    if (proccessPaymentFirstStep) {
      const headersConfig = {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/plain',
          Authorization: `Bearer ${proccessPaymentFirstStep.access_token}`,
        },
      };

      const requestData = {
        amount: amount,
        currency: 'BRL',
        order_id: order_id,
        customer_id: customer_id,
      };

      try {
        const responsePaymentPix = await lastValueFrom(
          this.httpService
            .post(
              `${process.env.GETNET_URL_API}/v1/payments/qrcode/pix `,
              requestData,
              headersConfig,
            )
            .pipe(map((response) => response.data)),
        );

        return responsePaymentPix;
      } catch (err) {
        throw new BadRequestException('Erro no pagamento', {
          cause: new Error(),
          description: 'Falha ao realizar o pagamento no pix',
        });
      }
    }
  }
}
