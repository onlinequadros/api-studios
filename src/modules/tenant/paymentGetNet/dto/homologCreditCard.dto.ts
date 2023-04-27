import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { NumberOrderType } from '../types/order.type';
import { HomologCustomerPaymentType } from '../types/homologCustomer.type';

export class getNetHomologCreditCardDTO {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  card_number: string;
  cardholder_name: string;
  security_code: string;
  expiration_month: string;
  expiration_year: string;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => NumberOrderType)
  order: NumberOrderType;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => HomologCustomerPaymentType)
  customer: HomologCustomerPaymentType;
}
