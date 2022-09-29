import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreatePhotoAlbumProductDto, ReadPhotoAlbumProductDto } from './dto';
import { PhotoAlbumProductService } from './photo-album-product.service';

@Controller('photo_album_product')
export class PhotoAlbumProductController {
  constructor(
    private readonly photoAlbumProductService: PhotoAlbumProductService,
  ) {}

  @Get()
  async findAll(): Promise<ReadPhotoAlbumProductDto[]> {
    return this.photoAlbumProductService.findAll();
  }

  @Post()
  async create(
    @Body() photoAlbumProduct: CreatePhotoAlbumProductDto,
  ): Promise<ReadPhotoAlbumProductDto> {
    return this.photoAlbumProductService.create(photoAlbumProduct);
  }
}
