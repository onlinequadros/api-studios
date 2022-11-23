import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateOrdersDTO } from './dto/createOrder.dto';
import { UpdateOrdersDTO } from './dto/updateOrder.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrdersDTO: CreateOrdersDTO) {
    return this.ordersService.create(createOrdersDTO);
  }

  @Get()
  async findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.ordersService.delete(id);
  }

  @Get('/report/:option')
  async ordersReport(@Param('option') option: string) {
    return this.ordersService.ordersReport(option);
  }

  @Get('/report/:start/:end')
  async ordersReportFilter(
    @Param('start') start: string,
    @Param('end') end: string,
  ) {
    return this.ordersService.ordersReportFilter(start, end);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOrdersDTO: UpdateOrdersDTO ) {
    return this.ordersService.update(id, updateOrdersDTO);
  }
}
