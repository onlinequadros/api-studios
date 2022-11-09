import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrdersDTO } from './dto/createOrder.dto';
import { Orders } from './entities/orders.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders)
    private readonly repository: Repository<Orders>,
  ) {}

  async create(createOrdersDTO: CreateOrdersDTO): Promise<Orders> {
    const order = await this.repository.create(createOrdersDTO);
    await this.repository.save(order);
    return order;
  }

  async findAll(): Promise<Orders[]> {
    const orders = await this.repository.find({
      order: {
        created_at: 'DESC',
      },
    });
    return orders;
  }

  async findOne(id: string): Promise<Orders> {
    return this.repository.findOne({
      id: id,
    });
  }

  async delete(id: string) {
    return this.repository.delete({
      id: id,
    });
  }
}
