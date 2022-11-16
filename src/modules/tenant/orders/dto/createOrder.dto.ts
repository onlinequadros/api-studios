import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsNumber, IsIn, Validate, IsArray } from 'class-validator';
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

  @IsString()
  @IsNotEmpty()
  @Expose()
  @IsIn(['Credit Card', 'Pix'])
  payment_type: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  installment: string;
  
  @IsNumber()
  @IsNotEmpty()
  @Expose()
  subtotal: number;

  @IsNumber()
  @IsNotEmpty()
  @Expose()
  discount: number;

  @IsNumber()
  @IsNotEmpty()
  @Expose()
  total_amount: number;

  @IsString()
  @IsNotEmpty()
  @Expose()
  notes: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  salesman: string;
  
  @IsString()
  @IsNotEmpty()
  @Expose()
  shipping_address: string;
  
  @IsString()
  @IsNotEmpty()
  @Expose()
  shipping_method: string;
  
  @IsString()
  @IsNotEmpty()
  @Expose()
  delivery_deadline: string;
  
  @IsNumber()
  @IsNotEmpty()
  @Expose()
  shipping_value: number;
  
  @IsString()
  @IsNotEmpty()
  @Expose()
  external_transaction_id: string;

  @IsIn(['APPROVED', 'RECUSED'])
  @Expose()
  status: 'APPROVED' | 'RECUSED';
}