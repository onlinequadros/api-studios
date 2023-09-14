import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CustomerPaymentType } from '../types/customer.type';
import { NumberOrderType } from '../types/order.type';

export class getNetCreditCardDTO {
  @IsString()
  @IsNotEmpty()
  card_number: string;
  cardholder_name: string;
  brand?: string;
  expiration_month: string;
  expiration_year: string;
  security_code: number;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => NumberOrderType)
  order: NumberOrderType;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CustomerPaymentType)
  customer: CustomerPaymentType;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
