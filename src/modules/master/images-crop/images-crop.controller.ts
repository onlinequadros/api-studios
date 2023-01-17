import { Controller, Post, Body } from '@nestjs/common';
import { ImageCropService } from './images-crop.service';
import { CropImageCut } from './interfaces/crop-image-cut';

@Controller('images-crop')
export class ImagesCropController {
  constructor(private readonly imageCropService: ImageCropService) {}

  @Post()
  async cropImage(@Body() cropImage: CropImageCut) {
    return this.imageCropService.cropImage(cropImage);
  }
}
