import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CustomerPaymentType } from '../types/customer.type';
import { NumberOrderType } from '../types/order.type';

export class getNetCreditCardDTO {
  @IsString()
  @IsNotEmpty()
  amount: string;
  card_number: string;
  cardholder_name: string;
  brand?: string;
  expiration_month: string;
  expiration_year: string;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => NumberOrderType)
  order: NumberOrderType;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CustomerPaymentType)
  customer: CustomerPaymentType;
}
