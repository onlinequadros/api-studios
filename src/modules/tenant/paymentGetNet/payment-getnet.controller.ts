import { Body, Controller, Post } from '@nestjs/common';
import { getNetCreditPixDTO } from './dto/credicPix.dto';
import { getNetCreditCardDTO } from './dto/creditCard.dto';
import { PaymentGetNetService } from './payment-getnet.service';
import { getNetHomologCreditCardDTO } from './dto/homologCreditCard.dto';
import { getNetHomologCreditPixDTO } from './dto/homologCreditPix.dto';

@Controller('getnet')
export class PaymentGetNetController {
  constructor(private readonly paymentGetNetService: PaymentGetNetService) {}

  @Post('/credit-card')
  async pagGetNetCreditCard(@Body() getnetCreditCardDTO: getNetCreditCardDTO) {
    return this.paymentGetNetService.paymentCreditCardGetNet(
      getnetCreditCardDTO,
    );
  }

  @Post('/homolog-credit-card')
  async pagGetNetHomologCreditCard(
    @Body() getnetCreditCardDTO: getNetHomologCreditCardDTO,
  ) {
    return this.paymentGetNetService.paymentHomologCreditCardGetNet(
      getnetCreditCardDTO,
    );
  }

  @Post('/credit-pix')
  async pagGetNetCreditPix(@Body() getnetCreditPixDTO: getNetCreditPixDTO) {
    return this.paymentGetNetService.paymentCreditPixGetNet(getnetCreditPixDTO);
  }

  @Post('/homolog-credit-pix')
  async pagGetNetHomologCreditPix(
    @Body() getnetHomologCreditPixDTO: getNetHomologCreditPixDTO,
  ) {
    return this.paymentGetNetService.paymentHomologCreditPixGetNet(
      getnetHomologCreditPixDTO,
    );
  }
}
