import { Body, Controller, Post } from '@nestjs/common';
import { PsCreditCardDTO } from './dto/ps_creditCard.dto';
import { PsPixDTO } from './dto/ps_pix.dto';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
   constructor(private readonly paymentService: PaymentService) {}

    @Post('/pag-seguro/credit-card')
    async pagSeguroCreditCard(@Body() psCreditCardDTO: PsCreditCardDTO ) {
        return this.paymentService.pagSeguroCreditCard(psCreditCardDTO);
    }

    @Post('pag-seguro/pix')
    async pagSeguroPix(@Body() psPixDTO: PsPixDTO ) {
        return this.paymentService.pagSeguroPix(psPixDTO);
    }
}
