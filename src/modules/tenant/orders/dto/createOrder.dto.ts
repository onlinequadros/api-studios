import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsNumber,
  IsIn,
  Validate,
  IsArray,
} from 'class-validator';
import { ValidateCpf } from '../../../custom/decorators/validateCpf';

export class CreateOrdersDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Id do usuário' })
  @Expose()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'User name do usuário' })
  @Expose()
  user_name: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  receiver_name: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  @Validate(ValidateCpf)
  cpf: string;

  @IsEmail()
  @IsNotEmpty()
  @Expose()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  product_album_name: string;

  @IsNumber()
  @IsNotEmpty()
  @Expose()
  amount_extra_photos: number;

  @IsNumber()
  @IsNotEmpty()
  @Expose()
  amount_photos: number;

  @Expose()
  orders_extra_items: any;

  @Expose()
  orders_extra_photos: any;

  @Expose()
  orders_photos: any;

  @IsString()
  @Expose()
  @IsIn(['Credit Card', 'Pix'])
  payment_type?: string;

  @IsString()
  @Expose()
  installment?: string;

  @IsNumber()
  @Expose()
  subtotal?: number;

  @IsNumber()
  @Expose()
  discount?: number;

  @IsNumber()
  @Expose()
  total_amount?: number;

  @IsString()
  @Expose()
  notes?: string;

  @IsString()
  @Expose()
  salesman?: string;

  @IsString()
  @Expose()
  shipping_address?: string;

  @IsString()
  @Expose()
  shipping_method?: string;

  @IsString()
  @Expose()
  delivery_deadline?: string;

  @IsNumber()
  @Expose()
  shipping_value?: number;

  @IsString()
  @Expose()
  external_transaction_id?: string;

  @IsIn(['APPROVED', 'RECUSED'])
  @Expose()
  status?: 'APPROVED' | 'RECUSED';
}
