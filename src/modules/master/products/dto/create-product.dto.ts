import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    @IsEnum(['Quadros', 'Comum'])
    type: string;

    @IsString()
    @IsNotEmpty()
    name: string;
    category: string;
    sku_father: string;
}
