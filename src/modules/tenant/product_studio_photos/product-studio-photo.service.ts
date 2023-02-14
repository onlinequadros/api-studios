import * as Jimp from 'jimp';
import * as fs from 'fs';
import * as webpConverter from 'webp-converter';
import * as bufferImageSize from 'buffer-image-size';
import {
  BadGatewayException,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { BucketS3Service } from '../../../bucket-s3/bucket-s3.service';
import { In, Repository } from 'typeorm';
import { TenantProvider } from '../tenant.provider';
import { CreateProductStudioPhotoDto, ReadProductStudioPhotoDto } from './dto';
import { ProductStudioPhoto } from './entities/product-studio-photo.entity';
import { EncryptedService } from '../../../modules/utils/encrypted.service';
import { checkCompany } from '../../../modules/utils/checkCompany';
import { ProductStudioService } from '../product_studio/product-studio.service';
import { ReadProductStudioDto } from '../product_studio/dtos';
import { SetCoverPhotoDTO } from '../product_studio/dtos/setCoverPhoto.dto';
import { RemoveImagesDTO } from './dto/remove-images.dto';
import { CheckImagesDTO } from './dto/check.dto';
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { ImagesService } from '../../../modules/utils/images.service';
import { checkWaterMark } from 'src/modules/utils/checkWaterMark';

//CADA REQUEST QUE SE CHAMA NA APLICAÇÃO ELA VAI CRIAR UMA NOVA INSTANCIA DESSA CLASSE
@Injectable({ scope: Scope.REQUEST })
export class ProductStudioPhotoService {
  private productStudioPhotoRepository: Repository<ProductStudioPhoto>;

  getProductStudioPhotoRepository() {
    if (TenantProvider.connection) {
      this.productStudioPhotoRepository =
        TenantProvider.connection.getRepository(ProductStudioPhoto);
    }
  }

  constructor(
    private readonly awsS3Service: BucketS3Service,
    private readonly encryptedService: EncryptedService,
    private readonly productStudio: ProductStudioService,
    private readonly imagesService: ImagesService,
  ) {
    this.getProductStudioPhotoRepository();
  }

  async findAll(): Promise<ReadProductStudioPhotoDto[]> {
    this.getProductStudioPhotoRepository();
    const productsStudioPhoto = await this.productStudioPhotoRepository.find();
    return productsStudioPhoto.map((studioPhoto) =>
      plainToInstance(ReadProductStudioPhotoDto, studioPhoto),
    );
  }

  async getImagesZipUrl(studio: string, usertype: string) {
    this.getProductStudioPhotoRepository();

    if (usertype === 'guest') {
      const productsStudioPhotosGuest =
        await this.productStudioPhotoRepository.find({
          where: {
            checked: true,
            order: true,
            visible: true,
          },
          select: ['id', 'url', 'photo'],
        });
      return this.awsS3Service.zipFiles(studio, productsStudioPhotosGuest);
    }

    if (usertype === 'client') {
      const productsStudioPhotosClient =
        await this.productStudioPhotoRepository.find({
          where: {
            checked: true,
            order: true,
          },
          select: ['id', 'url', 'photo'],
        });
      return this.awsS3Service.zipFiles(studio, productsStudioPhotosClient);
    }
  }

  async findAllImagesHigh(imgIds: string[]): Promise<any[]> {
    this.getProductStudioPhotoRepository();

    const productsStudioPhoto = await this.productStudioPhotoRepository.find({
      where: { id: In(imgIds) },
      select: ['url', 'id'],
    });
    return productsStudioPhoto.map((studioPhoto) =>
      plainToInstance(ReadProductStudioPhotoDto, studioPhoto),
    );
  }

  async verifyImagesHired(quantity: string): Promise<boolean> {
    this.getProductStudioPhotoRepository();

    const productsStudioPhoto = await this.productStudioPhotoRepository.find({
      where: {
        checked: true,
        order: true,
      },
    });

    if (productsStudioPhoto.length < Number(quantity)) {
      return false;
    }

    return true;
  }

  async create(
    productStudioPhoto: CreateProductStudioPhotoDto,
  ): Promise<ReadProductStudioPhotoDto> {
    this.getProductStudioPhotoRepository();

    let createPhotoStudioPhoto;
    try {
      productStudioPhoto.photos.forEach((element) => {
        const newProductStudioPhoto = this.productStudioPhotoRepository.create({
          photo: element.image,
          feature_photo: false,
          url: '123456789',
          product_photo_id: {
            id: productStudioPhoto.products_id,
          },
        });

        createPhotoStudioPhoto = this.productStudioPhotoRepository.save(
          newProductStudioPhoto,
        );
      });

      return plainToClass(ReadProductStudioPhotoDto, createPhotoStudioPhoto);
    } catch (err) {
      throw new BadGatewayException(err.message);
    }
  }

  // FUNÇÃO PARA INCLUIR A MARDA D`AGUA NA IMAGEM ******************************
  async waterMark(
    wartermakPath: string,
    sourcePath: string,
    outputPath: string,
  ) {
    try {
      await sharp(sourcePath)
        .composite([
          {
            input: wartermakPath,
            top: 0,
            left: 0,
            blend: 'over',
            tile: true,
          },
        ])
        .webp({ quality: 90 })
        .toFile(outputPath);
    } catch (err) {
      console.log('error do watermark ', err);
    }
  }

  //FUNÇÃO PARA REALIZAR O UPLOAD DE IMAGENS DOS ESTÚDIOS PARA A APLICAÇÃO *****
  async uploadImages(images, products_id, category, request) {
    this.getProductStudioPhotoRepository();

    const company = await checkCompany(request);

    const { slug } = await this.productStudio.findById(products_id);

    let createPhotoStudioPhoto;
    try {
      for (const element of images['images']) {
        await fs.promises.mkdir('tmp', { recursive: true });
        await fs.promises.writeFile(
          `tmp/${element.originalname}`,
          element.buffer,
        );
        const encryptedImageName =
          await this.encryptedService.encryptedImageName(element.originalname);
        const fileName = `${encryptedImageName.split('.jpg')}.webp`;

        const imageSize = bufferImageSize(element.buffer);
        const waterMarkImage = checkWaterMark(imageSize);

        await this.waterMark(
          `src/assets/${waterMarkImage}.png`,
          `tmp/${element.originalname}`,
          `tmp/${fileName}`,
        );

        const { Location } = await this.awsS3Service.uploadLocalFileToBucket(
          `tagged-images/${fileName}`,
          `tmp/${fileName}`,
          'image/webp',
          true,
        );
        const highResolutionImageUrl = await this.awsS3Service.uploadImage(
          company,
          category,
          slug,
          element,
          encryptedImageName,
        );
        const id = fileName.split('.')[0];
        const newProductStudioPhoto = this.productStudioPhotoRepository.create({
          id: id,
          photo: encryptedImageName,
          feature_photo: false,
          url: highResolutionImageUrl,
          low_resolution_image: Location,
          checked: false,
          order: false,
          product_photo_id: {
            id: products_id,
          },
        });
        createPhotoStudioPhoto = await this.productStudioPhotoRepository.save(
          newProductStudioPhoto,
        );
      }

      await fs.promises.rm('tmp', { recursive: true });
      return plainToClass(ReadProductStudioPhotoDto, createPhotoStudioPhoto);
    } catch (err) {
      throw new BadGatewayException(err.message);
    }
  }

  async setCoverPhoto(id: string, data: SetCoverPhotoDTO) {
    this.getProductStudioPhotoRepository();

    const product = await this.productStudio.findOneProduct(data.productId);

    product.product_studio_photo.forEach(async (image) => {
      if (image.feature_photo == true) {
        await this.desableCoverPhoto(image.id);
        return;
      }
    });

    const image = await this.productStudioPhotoRepository.findOne(id);
    image.feature_photo = data.isActive;

    return await this.productStudioPhotoRepository.save(image);
  }

  // FUNÇÃO PARA DEIXAR A IMAGEM VISÍVEL OU NÃO PARA O CONVIDADO ***************
  async setOptionVisibleImage(id: string) {
    this.getProductStudioPhotoRepository();

    const image = await this.productStudioPhotoRepository.findOne(id);
    image.visible = !image.visible;

    return await this.productStudioPhotoRepository.save(image);
  }

  async desableCoverPhoto(id: string): Promise<void> {
    this.getProductStudioPhotoRepository();
    const image = await this.productStudioPhotoRepository.findOne(id);
    image.feature_photo = false;
    await this.productStudioPhotoRepository.save(image);
  }

  async delete(request, data: RemoveImagesDTO) {
    this.getProductStudioPhotoRepository();
    const images = [];
    const imagesKey = [];

    const company = await checkCompany(request);

    const product = await this.productStudio.findById(data.productId);

    data.images.forEach((image) => {
      images.push(image.id);
      imagesKey.push(
        company + '/' + data.category + '/' + product.slug + '/' + image.photo,
      );
    });

    await this.productStudioPhotoRepository.delete(images);
    await this.awsS3Service.deleteImages(imagesKey);

    return true;
  }

  async setCheckedOrder(checkImagesDTO: CheckImagesDTO) {
    this.getProductStudioPhotoRepository();
    const { images } = checkImagesDTO;

    const verifyPhotoChecked = await this.productStudioPhotoRepository.find({
      where: { id: images[0].id },
    });

    if (images[0].order === false && verifyPhotoChecked[0].order === true) {
      throw new UnauthorizedException(
        'Foto já finalizada o processo de compra, você não poderá mais desmarcar.',
      );
    }

    images.forEach(async (image) => {
      await this.productStudioPhotoRepository
        .createQueryBuilder()
        .update(ProductStudioPhoto)
        .set({
          checked: image.check,
          order: image.order,
        })
        .where('id = :id', { id: image.id })
        .execute();
    });
  }

  async convertImageLowResolution(element, cryptImageName) {
    const { data, info } = await sharp(element.buffer)
      .webp({ effort: 6 })
      .toBuffer({ resolveWithObject: true });

    const splitCryptImageName = cryptImageName.split('.');

    const image = {
      //id: splitCryptImageName.shift(),
      fieldname: 'images',
      originalname: splitCryptImageName.shift() + `.${info.format}`,
      mimetype: 'image/' + info.format,
      buffer: data,
      size: info.size,
    };

    return image;
  }

  async findOne(id: string) {
    this.getProductStudioPhotoRepository();
    const image = this.productStudioPhotoRepository.findOne({
      where: {
        id: id,
      },
    });
    return image;
  }
}
