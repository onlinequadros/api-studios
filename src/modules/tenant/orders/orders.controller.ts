import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CheckImagesDTO } from '../product_studio_photos/dto/check.dto';
import { CreateOrdersDTO } from './dto/createOrder.dto';
import { UpdateOrdersDTO } from './dto/updateOrder.dto';
import { UpdateOrderItemsDto } from './dto/updateOrderItems.dto';
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

  @Delete('/extra-photo/:id')
  async deleteExtraPhoto(
    @Param('id') orderId: string,
    @Body() imageId: string,
  ) {
    return this.ordersService.deleteExtraPhoto(orderId, imageId);
  }

  @Delete('/extra-items/:id')
  async deleteExtraItem(@Param('id') id: string, @Body() itemId: string) {
    return this.ordersService.deleteExtraItem(id, itemId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrdersDTO: UpdateOrdersDTO,
  ) {
    return this.ordersService.update(id, updateOrdersDTO);
  }

  @Patch('/quantity/:id')
  async updateQuantityOrder(
    @Param('id') id: string,
    @Body() payload: { quantity: number; id: string },
  ) {
    return this.ordersService.updateQuantity(id, payload);
  }

  @Patch('/status-payment/:id')
  async updateStatusOrderPayment(
    @Param('id') id: string,
    @Body() status: { status: 'APPROVED' | 'RECUSED' },
  ) {
    return this.ordersService.updateStatusOrderPayment(id, status);
  }

  @Put('/order-extra-items/:id_order/:id_extraitems')
  async updateExtraItems(
    @Param('id_order') id_order: string,
    @Param('id_extraitems') id_extraitems: string,
    @Body() updateOrderItemsDto: UpdateOrderItemsDto,
  ) {
    return this.ordersService.updateExtraItems(
      id_order,
      id_extraitems,
      updateOrderItemsDto,
    );
  }
}
