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
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateProductStudioPhotoDto, ReadProductStudioPhotoDto } from './dto';
import { ProductStudioPhotoService } from './product-studio-photo.service';
import { Request } from 'express';
import { SetCoverPhotoDTO } from '../product_studio/dtos/setCoverPhoto.dto';
import { RemoveImagesDTO } from './dto/remove-images.dto';
import { CheckImagesDTO } from './dto/check.dto';
import { ProductStudioPhoto } from './entities/product-studio-photo.entity';
import { BuyImages } from './interface/update-buy.interface';

@Controller('product-studio-photo')
export class ProductStudioPhotoController {
  constructor(
    private readonly productStudioPhotoService: ProductStudioPhotoService,
  ) {}

  @Get()
  async findAll(): Promise<ReadProductStudioPhotoDto[]> {
    return this.productStudioPhotoService.findAll();
  }

  @Get('/link/:studio/:usertype/:name/:email')
  async getImagesZipUrl(
    @Param('studio') studio: string,
    @Param('usertype') usertype: string,
    @Param('name') name: string,
    @Param('email') email: string,
  ) {
    return this.productStudioPhotoService.getImagesZipUrl(
      studio,
      usertype,
      name,
      email,
    );
  }

  @Get('/images-high')
  async findImagesHigh(
    @Body() imgIds: string[],
  ): Promise<ProductStudioPhoto[]> {
    return this.productStudioPhotoService.findAllImagesHigh(imgIds);
  }

  @Get('/verify-photos-hired/:quantity')
  async verifyPhotosHired(
    @Param('quantity') quantity: string,
  ): Promise<boolean> {
    return this.productStudioPhotoService.verifyImagesHired(quantity);
  }

  @Post()
  async create(
    @Body() createProductStudioPhotoDto: CreateProductStudioPhotoDto,
  ): Promise<ReadProductStudioPhotoDto> {
    const responseVerifyImage = await this.productStudioPhotoService.create(
      createProductStudioPhotoDto,
    );
    return responseVerifyImage;
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

  @Patch('/visible-image/:id')
  async setVisibleImage(@Param('id') id: string) {
    return await this.productStudioPhotoService.setOptionVisibleImage(id);
  }

  @Patch('/buy-image-frame/:id')
  async setBuyImageFrame(
    @Param('id') id: string,
    @Body() buyImages: BuyImages,
  ) {
    return await this.productStudioPhotoService.setBuyImageFrame(id, buyImages);
  }

  @Patch('/buy-image-picture-frame/:id')
  async setBuyImagePictureFrame(
    @Param('id') id: string,
    @Body() buyImages: BuyImages,
  ) {
    return await this.productStudioPhotoService.setBuyImagePictureFrame(
      id,
      buyImages,
    );
  }

  @Delete()
  async delete(@Req() request: Request, @Body() data: RemoveImagesDTO) {
    return await this.productStudioPhotoService.delete(request, data);
  }
}
