import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { MandaeDTO } from './dto/mandae.dto';

@Injectable()
export class ShippingService {
  private readonly logger = new Logger(ShippingService.name);
  constructor(private readonly httpService: HttpService) {}

  async mandae(cep: string, mandaeDTO: MandaeDTO) {
    const url = `http://api.mandae.com.br/v3/postalcodes/${cep}/rates`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: process.env.MANDAE_TOKEN,
    };

    try {
      const shipping = await lastValueFrom(
        this.httpService
          .post(url, mandaeDTO, { headers: headers })
          .pipe(map((response) => response.data)),
      );

      return shipping;
    } catch (error) {
      this.logger.error(error.stack, 'Mandae - Falha no cálculo do frete');
      throw new HttpException('Mandae - Falha no cálculo do frete', 400);
    }
  }
}
