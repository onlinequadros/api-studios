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
import { CreateProductStudioDto, ReadProductStudioDto } from './dtos';
import { IResponseProductStudioData } from './interfaces/product-studio.interface';
import { ProductStudioService } from './product-studio.service';

@Controller('products-studio')
export class ProductStudioController {
  constructor(private readonly productStudioService: ProductStudioService) {}

  @Get()
  // @UseGuards(JwtAuthGuard)
  async findAll(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('search') search: string,
  ): Promise<IResponseProductStudioData> {
    return this.productStudioService.findAll({ limit, page, search });
  }

  @Get(':slug')
  // @UseGuards(JwtAuthGuard)
  async findOne(@Param('slug') slug: string): Promise<ReadProductStudioDto> {
    return this.productStudioService.findOneProduct(slug);
  }

  @Post()
  // @UseGuards(JwtAuthGuard)
  async create(
    @Body() product: CreateProductStudioDto,
  ): Promise<ReadProductStudioDto> {
    return this.productStudioService.create(product);
  }

  @Get('/slug/:slug')
  // @UseGuards(JwtAuthGuard)
  async verifySlugExists(
    @Param('slug') slug: string,
  ): Promise<{ available: boolean }> {
    return this.productStudioService.validateSlugIsUnique(slug);
  }
}
