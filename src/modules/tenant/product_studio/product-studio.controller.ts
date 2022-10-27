import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProductStudioDto, ReadProductStudioDto } from './dtos';
import { IResponseProductStudioData } from './interfaces/product-studio.interface';
import { ProductStudioService } from './product-studio.service';
import {Request} from 'express';
import { UpdateProductStudioDTO } from './dtos/updateProduct.dto';

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
    return this.productStudioService.findOne(slug);
  }

  @Get('/product/:id')
  // @UseGuards(JwtAuthGuard)
  async findOneProduct(@Param('id') id: string) {
    return this.productStudioService.findOneProduct(id);
  }

  @Post()
  // @UseGuards(JwtAuthGuard)
  async create(
    @Body() product: CreateProductStudioDto,
    @Req() request: Request,
  ): Promise<ReadProductStudioDto> {
    return this.productStudioService.create(request, product);
  }

  @Patch()
  // @UseGuards(JwtAuthGuard)
  async update(
    @Body() updateProductStudioDTO: UpdateProductStudioDTO,
  ): Promise<ReadProductStudioDto> {
    return this.productStudioService.update(updateProductStudioDTO);
  }

  @Get('/slug/:slug')
  // @UseGuards(JwtAuthGuard)
  async verifySlugExists(
    @Param('slug') slug: string,
  ): Promise<{ available: boolean }> {
    return this.productStudioService.validateSlugIsUnique(slug);
  }

  @Delete(':id')
  async deleteProductStudio(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<boolean> {
    return this.productStudioService.deleteProduct(request, id);
  }
}
