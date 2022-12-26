import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  // @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  // @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Get('guidance/:type')
  async findGuidance(@Param('type') type: string) {
    return this.productsService.findGuidance(type);
  }

  @Get('list-frames/:frame/:size')
  async listFramesPerDimensions(
    @Param('frame') frame: string,
    @Param('size') size: string,
  ) {
    return this.productsService.findFrame(frame, size);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
