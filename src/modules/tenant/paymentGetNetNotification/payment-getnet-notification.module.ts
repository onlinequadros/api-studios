import { Module } from '@nestjs/common';
import { PaymentGetNetNotificationController } from './payment-getnet-notification.controller';
import { PaymentGetNetNotificationService } from './payment-getnet-notification.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  exports: [],
  controllers: [PaymentGetNetNotificationController],
  providers: [PaymentGetNetNotificationService],
})
export class PaymentGetNetNotificationModule {}
