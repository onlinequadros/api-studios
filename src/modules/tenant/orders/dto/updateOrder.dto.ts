import { PartialType } from '@nestjs/mapped-types';
import { CreateOrdersDTO } from './createOrder.dto';

export class UpdateOrdersDTO extends PartialType(CreateOrdersDTO) {}