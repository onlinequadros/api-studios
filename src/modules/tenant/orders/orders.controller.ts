import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateOrdersDTO } from './dto/createOrder.dto';
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
}
