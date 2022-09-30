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
import { CreateProductArtistDto, ReadProductArtistDto } from './dtos';
import { IResponseProductArtisticData } from './interfaces/product-artist.interface';
import { ProductArtistService } from './product-artist.service';

@Controller('products-artist')
export class ProductArtistController {
  constructor(private readonly productArtistService: ProductArtistService) {}

  @Get()
  // @UseGuards(JwtAuthGuard)
  async findAll(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('search') search: string,
  ): Promise<IResponseProductArtisticData> {
    return this.productArtistService.findAll({ limit, page, search });
  }

  @Get(':product_id')
  // @UseGuards(JwtAuthGuard)
  async findOne(
    @Param('product_id') product_id: string,
  ): Promise<ReadProductArtistDto> {
    return this.productArtistService.findOneProduct(product_id);
  }

  @Post()
  // @UseGuards(JwtAuthGuard)
  async create(
    @Body() product: CreateProductArtistDto,
  ): Promise<ReadProductArtistDto> {
    return this.productArtistService.create(product);
  }
}
