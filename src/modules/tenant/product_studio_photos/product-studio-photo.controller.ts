import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
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
import { Request } from 'express';
import { SetCoverPhotoDTO } from '../product_studio/dtos/setCoverPhoto.dto';
import { RemoveImagesDTO } from './dto/remove-images.dto';
import { CheckImagesDTO } from './dto/check.dto';

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
    @Body() data: { products_id: string; category: string },
    @Req() request: Request,
  ) {
    return await this.productStudioPhotoService.uploadImages(
      images,
      data.products_id,
      data.category,
      request,
    );
  }

  @Patch('set-cover-photo/:id')
  async setCoverPhoto(@Param('id') id: string, @Body() data: SetCoverPhotoDTO) {
    return await this.productStudioPhotoService.setCoverPhoto(id, data);
  }

  @Put('/check')
  async check(@Body() checkImagesDTO: CheckImagesDTO) {
    return await this.productStudioPhotoService.setCheckedOrder(checkImagesDTO);
  }

  @Delete()
  async delete(@Req() request: Request, @Body() data: RemoveImagesDTO) {
    return await this.productStudioPhotoService.delete(request, data);
  }
}
