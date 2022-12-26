import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  product_code: string;
  name: string;
  img_frame: string;
  img: string;
  description: string;

  @IsIn(['Category1', 'Category2'])
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  reference: string;

  @IsIn(['Canaleta', 'Caixa', 'Filete'])
  type: string;

  @IsNotEmpty()
  @IsString()
  color: string;

  @IsNotEmpty()
  @IsNumber()
  depth: number;
  height: number;
  height_px: number;
  width: number;
  width_px: number;

  @IsIn(['Quadrado', 'Paisagem', 'Retrato'])
  guidance: string;

  @IsNotEmpty()
  @IsNumber()
  weight: number;

  @IsNotEmpty()
  @IsString()
  background: string;
  sku_father: string;
  paper: string;

  @IsIn(['vidro', 'sem protecao', 'com protecao'])
  finishing: string;

  @IsIn(['linha decoracao'])
  print_type: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  declaredValue: number;

  @IsNotEmpty()
  @IsString()
  proportion: string;
}
