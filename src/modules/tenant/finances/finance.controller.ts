import { Controller, Get } from '@nestjs/common';
import { FinanceService } from './finance.service';

@Controller('finances')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('/wallets')
  async findFinance() {
    return this.financeService.findValuesOrders();
  }
}
