import { Body, Controller, Post } from '@nestjs/common';
import { getNetCreditPixDTO } from './dto/credicPix.dto';
import { getNetCreditCardDTO } from './dto/creditCard.dto';
import { PaymentGetNetService } from './payment-getnet.service';
import { getNetHomologCreditCardDTO } from './dto/homologCreditCard.dto';
import { getNetHomologCreditPixDTO } from './dto/homologCreditPix.dto';
import { getNetHomologCancelCreditPixDTO } from './dto/homologCancelCreditPix.dto';

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

  @Post('/prod-credit-card')
  async pagGetNetProdCreditCard(
    @Body() getnetCreditCardDTO: getNetHomologCreditCardDTO,
  ) {
    return this.paymentGetNetService.paymentProdCreditCardGetNet(
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

  @Post('/prod-credit-pix')
  async pagGetNetProdCreditPix(
    @Body() getnetHomologCreditPixDTO: getNetHomologCreditPixDTO,
  ) {
    return this.paymentGetNetService.paymentProdCreditPixGetNet(
      getnetHomologCreditPixDTO,
    );
  }

  @Post('/homolog-cancel-credit-pix')
  async pagGetNetHomologCancelCreditPix(
    @Body() getnetHomologCancelCreditPixDTO: getNetHomologCancelCreditPixDTO,
  ) {
    return this.paymentGetNetService.paymentHomologCancelCreditPixGetNet(
      getnetHomologCancelCreditPixDTO,
    );
  }
}
