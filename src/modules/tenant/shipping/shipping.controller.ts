import { Body, Controller, Param, Post } from '@nestjs/common';
import { MandaeDTO } from './dto/mandae.dto';
import { ShippingService } from './shipping.service';

@Controller('shipping')
export class ShippingController {
    constructor(private readonly shippingService: ShippingService) {}

    @Post('mandae/:cep')
    async mandae(@Param('cep') cep: string, @Body() mandaeDTO: MandaeDTO) {
        return this.shippingService.mandae(cep, mandaeDTO);     
    }
}
