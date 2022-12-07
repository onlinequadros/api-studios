import { Type } from "class-transformer";
import { IsNotEmptyObject, ValidateNested } from "class-validator";
import { PixPurchasePs } from "../types/pixPurchasePs.type";
import { UserPaymentType } from "../types/userPayment.type";

export class PsPixDTO {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => UserPaymentType)
  user: UserPaymentType;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => PixPurchasePs)
  purchase: PixPurchasePs
}