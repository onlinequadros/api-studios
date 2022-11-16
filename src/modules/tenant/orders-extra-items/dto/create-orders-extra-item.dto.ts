import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateOrdersExtraItemDto {
    @IsString()
    @IsNotEmpty()
    product_id: string;
    sku: string;
    product_name: string;
    url: string;
    category: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsString()
    @IsNotEmpty()
    image_cropped: string;
}
