import { PartialType } from '@nestjs/swagger';
import { CreateOrdersDTO } from './createOrder.dto';

export class UpdateOrdersDTO extends PartialType(CreateOrdersDTO) {}
