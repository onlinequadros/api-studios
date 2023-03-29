import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PaymentGetNetService } from './payment-getnet.service';
import { PaymentGetNetController } from './payment-getnet.controller';

@Module({
  imports: [HttpModule],
  providers: [PaymentGetNetService],
  controllers: [PaymentGetNetController],
})
export class PaymentGetNetModule {}
