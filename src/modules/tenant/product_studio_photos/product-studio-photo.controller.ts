import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateProductStudioPhotoDto, ReadProductStudioPhotoDto } from './dto';
import { ProductStudioPhotoService } from './product-studio-photo.service';

@Controller('product-studio-photo')
export class ProductStudioPhotoController {
  constructor(
    private readonly productStudioPhotoService: ProductStudioPhotoService,
  ) {}

  @Get()
  async findAll(): Promise<ReadProductStudioPhotoDto[]> {
    return this.productStudioPhotoService.findAll();
  }

  @Post()
  async create(
    @Body() productStudioPhoto: CreateProductStudioPhotoDto,
  ): Promise<ReadProductStudioPhotoDto> {
    return this.productStudioPhotoService.create(productStudioPhoto);
  }
}
