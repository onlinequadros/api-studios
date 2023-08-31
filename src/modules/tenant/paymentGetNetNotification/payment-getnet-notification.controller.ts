import { Controller, Get, Query } from '@nestjs/common';
import { PaymentGetNetNotificationService } from './payment-getnet-notification.service';

@Controller('getnet-notification')
export class PaymentGetNetNotificationController {
  constructor(
    private readonly paymentGetNetNotificationService: PaymentGetNetNotificationService,
  ) {}

  @Get('/pix')
  async getResponsePix(
    @Query('payment_type') payment_type: string,
    @Query('customer_id') customer_id: string,
    @Query('order_id') order_id: string,
    @Query('payment_id') payment_id: string,
    @Query('amount') amount: string,
    @Query('status') status: string,
    @Query('transaction_id') transaction_id: string,
    @Query('transaction_timestamp') transaction_timestamp: string,
    @Query('receiver_psp_name') receiver_psp_name: string,
    @Query('receiver_psp_code') receiver_psp_code: string,
    @Query('receiver_name') receiver_name: string,
    @Query('receiver_cnpj') receiver_cnpj: string,
    @Query('receiver_cpf') receiver_cpf: string,
    @Query('terminal_nsu') terminal_nsu: string,
  ): Promise<any> {
    return this.paymentGetNetNotificationService.notificationPaymentPix({
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
    });
  }
}
