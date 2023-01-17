import { Injectable } from '@nestjs/common';
import { ProductStudioPhoto } from 'src/modules/tenant/product_studio_photos/entities/product-studio-photo.entity';
import { TenantProvider } from 'src/modules/tenant/tenant.provider';
import { Repository } from 'typeorm';
import { CropImageCut, IParams } from './interfaces/crop-image-cut';
import { DatabaseProvider } from '../../shared/database/database.provider';
import { crop } from './utils/crop-function';
import { BucketS3Service } from 'src/bucket-s3/bucket-s3.service';

@Injectable()
export class ImageCropService {
  private productStudioPhotoRepository: Repository<ProductStudioPhoto>;
  private bucketS3Service = new BucketS3Service();

  async getProductStudioPhotoRepository(database?: string) {
    if (TenantProvider.connection) {
      this.productStudioPhotoRepository =
        TenantProvider.connection.getRepository(ProductStudioPhoto);
    } else {
      TenantProvider.connection = await new DatabaseProvider().getConnection(
        database,
        true,
      );
      this.productStudioPhotoRepository =
        TenantProvider.connection.getRepository(ProductStudioPhoto);
    }
  }

  async cropImage(cropImage: CropImageCut): Promise<void> {
    await this.getProductStudioPhotoRepository(cropImage.studio);

    const paramsCrop: IParams = JSON.parse(cropImage.params);

    const productsStudioPhoto = await this.productStudioPhotoRepository.findOne(
      {
        where: { id: cropImage.id },
        select: ['url', 'id'],
      },
    );

    // INICIA O CROP DA IMAGEM
    const responseCrop = await crop(
      cropImage.id,
      productsStudioPhoto.url,
      paramsCrop.x,
      paramsCrop.y,
      paramsCrop.width,
      paramsCrop.height,
    );

    if (responseCrop) {
      // PASSA A IMAGEM PARA O S3
      const filePath = await this.bucketS3Service.uploadLocalFileToBucket(
        `images-cropped/${cropImage.id}.jpeg`,
        responseCrop,
      );

      return this.bucketS3Service.getSignedUrl(filePath);
    }
  }
}
