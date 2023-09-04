import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { IPaymentPixParams } from './interface';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class PaymentGetNetNotificationService {
  constructor(private readonly httpService: HttpService) {}

  async notificationPaymentPix({
    payment_type,
    customer_id,
    order_id,
    payment_id,
    amount,
    status,
    transaction_id,
    transaction_timestamp,
    receiver_psp_name,
    receiver_psp_code,
    receiver_name,
    receiver_cnpj,
    receiver_cpf,
    terminal_nsu,
  }: IPaymentPixParams) {
    // return { ok: true };
    const responsePixNotification = await lastValueFrom(
      this.httpService
        .get(
          `${process.env.HOST_SERVER}?payment_type=${payment_type}&customer_id=${customer_id}&order_id=${order_id}&payment_id=${payment_id}&amount=${amount}&status=${status}&transaction_id=${transaction_id}&transaction_timestamp=${transaction_timestamp}&receiver_psp_name=${receiver_psp_name}&receiver_psp_code=${receiver_psp_code}&receiver_name=${receiver_name}&receiver_cnpj=${receiver_cnpj}&receiver_cpf=${receiver_cpf}&terminal_nsu=${terminal_nsu}`,
        )
        .pipe(map((response) => response.data)),
    );

    console.log('response Pix ', responsePixNotification);
  }
}
