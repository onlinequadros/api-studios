import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, MoreThan, Repository } from 'typeorm';
import { TenantProvider } from '../tenant.provider';
import { CreateOrdersDTO } from './dto/createOrder.dto';
import { Orders } from './entities/orders.entity';
import * as moment from 'moment';
import { UpdateOrdersDTO } from './dto/updateOrder.dto';

@Injectable()
export class OrdersService {
  private ordersRepository: Repository<Orders>;

  getOrdersRepository() {
    if (TenantProvider.connection) {
      this.ordersRepository = TenantProvider.connection.getRepository(Orders);
    }
  }
  constructor(
    @InjectRepository(Orders)
    private readonly repository: Repository<Orders>,
  ) {
    this.getOrdersRepository();
  }

  async create(createOrdersDTO: CreateOrdersDTO): Promise<Orders> {
    this.getOrdersRepository();
    const { orders_extra_item, orders_extra_photos, orders_photos } =
      createOrdersDTO;

    const order = await this.ordersRepository.create(createOrdersDTO);
    order.orders_extra_item = orders_extra_item;
    order.orders_extra_photo = orders_extra_photos;
    order.orders_photo = orders_photos;

    await this.ordersRepository.save(order);

    return order;
  }

  async findAll(): Promise<Orders[]> {
    this.getOrdersRepository();
    const orders = await this.ordersRepository.find({
      order: {
        created_at: 'DESC',
      },
      relations: ['orders_extra_item', 'orders_extra_photo', 'orders_photo'],
    });
    return orders;
  }

  async findOne(id: string): Promise<Orders> {
    this.getOrdersRepository();
    return this.ordersRepository.findOne({
      where: {
        id: id,
      },
      relations: ['orders_extra_item', 'orders_extra_photo', 'orders_photo'],
    });
  }

  async delete(id: string) {
    this.getOrdersRepository();
    return await this.ordersRepository.delete({
      id: id,
    });
  }

  async ordersReport(option: any): Promise<Orders[]> {
    this.getOrdersRepository();
    const startDate = moment().startOf(option);
    const endDate = moment().endOf(option);

    const orders = await this.ordersRepository.find({
      where: {
        created_at: Between(startDate, endDate),
      },
      order: {
        created_at: 'DESC',
      },
      relations: ['orders_extra_item', 'orders_extra_photo', 'orders_photo'],
    });
    return orders;
  }

  async ordersReportFilter(start: string, end: string): Promise<Orders[]> {
    this.getOrdersRepository();

    const orders = await this.ordersRepository.find({
      where: {
        created_at: Between(start, end),
      },
      order: {
        created_at: 'DESC',
      },
      relations: ['orders_extra_item', 'orders_extra_photo', 'orders_photo'],
    });
    return orders;
  }

  async update(id: string, updateOrdersDTO: UpdateOrdersDTO) {
    this.getOrdersRepository();

    const order = await this.findOne(id);

    const orderUpdated = Object.assign(order, updateOrdersDTO);

    const orderSaved = await this.ordersRepository.save(orderUpdated);

    return orderSaved;
  }
}
