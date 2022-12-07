import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmptyObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AddressPaymentType } from '../types/addressPayment.type';
import { CreditCardPaymentType } from '../types/creditCardPayment.type';
import { ItemPaymentType } from '../types/itemPayment.type';
import { PurchasePaymentType } from '../types/purchasePayment.type';
import { UserPaymentType } from '../types/userPayment.type';

export class PsCreditCardDTO {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => UserPaymentType)
  user: UserPaymentType;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => ItemPaymentType)
  item: ItemPaymentType;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => AddressPaymentType)
  address: AddressPaymentType;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => PurchasePaymentType)
  purchase: PurchasePaymentType;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreditCardPaymentType)
  card: CreditCardPaymentType;
}
