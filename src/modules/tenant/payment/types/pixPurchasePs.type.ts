import { IsNotEmpty, IsNumber } from "class-validator";

export class PixPurchasePs {
    @IsNumber()
    @IsNotEmpty()
    value: number
}