import { Body, Controller, Post } from '@nestjs/common';
import { getNetCreditPixDTO } from './dto/credicPix.dto';
import { getNetCreditCardDTO } from './dto/creditCard.dto';
import { PaymentGetNetService } from './payment-getnet.service';

@Controller('getnet')
export class PaymentGetNetController {
  constructor(private readonly paymentGetNetService: PaymentGetNetService) {}

  @Post('/credit-card')
  async pagGetNetCreditCard(@Body() getnetCreditCardDTO: getNetCreditCardDTO) {
    return this.paymentGetNetService.paymentCreditCardGetNet(
      getnetCreditCardDTO,
    );
  }

  @Post('/credit-pix')
  async pagGetNetCreditPix(@Body() getnetCreditPixDTO: getNetCreditPixDTO) {
    return this.paymentGetNetService.paymentCreditPixGetNet(getnetCreditPixDTO);
  }
}
