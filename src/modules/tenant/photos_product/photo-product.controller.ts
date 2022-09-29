import { Body, Controller, Get, Post } from '@nestjs/common';
import { PhotoProductService } from './photo-product.service';
import { CreatePhotoProductDto, ReadPhotoProductDto } from './dto';

@Controller('photo_product')
export class PhotoProductController {
  constructor(private readonly photoProductService: PhotoProductService) {}

  @Get()
  async findAll(): Promise<ReadPhotoProductDto[]> {
    return this.photoProductService.findAll();
  }

  @Post()
  async create(
    @Body() photoProduct: CreatePhotoProductDto,
  ): Promise<ReadPhotoProductDto> {
    return this.photoProductService.create(photoProduct);
  }
}
