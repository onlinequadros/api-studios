import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProductDto, ReadProductDto } from './dto';
import { IResponseProductData } from './interfaces/response-products.interface';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  // @UseGuards(JwtAuthGuard)
  async findAll(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('search') search: string,
  ): Promise<IResponseProductData> {
    return this.productService.findAll({ limit, page, search });
  }

  @Get(':product_id')
  // @UseGuards(JwtAuthGuard)
  async findOne(
    @Param('product_id') product_id: string,
  ): Promise<ReadProductDto> {
    return this.productService.findOneProduct(product_id);
  }

  @Post()
  async create(@Body() product: CreateProductDto): Promise<ReadProductDto> {
    return this.productService.create(product);
  }
}
