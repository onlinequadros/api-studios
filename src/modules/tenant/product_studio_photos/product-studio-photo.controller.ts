import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  AnyFilesInterceptor,
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
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
    @Body() createProductStudioPhotoDto: CreateProductStudioPhotoDto,
  ): Promise<ReadProductStudioPhotoDto> {
    return this.productStudioPhotoService.create(createProductStudioPhotoDto);
  }

  @Post('/upload_images')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images' }]))
  async uploadImages(
    @UploadedFiles() images: { images?: Express.Multer.File[] },
    @Body() data: { products_id:string, category: string, company: string }
  ) {

    return await this.productStudioPhotoService.uploadImages(
      images,
      data.products_id,
      data.category,
      data.company
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {}
}
