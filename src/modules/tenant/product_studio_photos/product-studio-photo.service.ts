import { BadGatewayException, Injectable, Scope } from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { BucketS3Service } from '../../../bucket-s3/bucket-s3.service';
import { Repository } from 'typeorm';
import { TenantProvider } from '../tenant.provider';
import { CreateProductStudioPhotoDto, ReadProductStudioPhotoDto } from './dto';
import { ProductStudioPhoto } from './entities/product-studio-photo.entity';
import { EncryptedService } from '../../../modules/utils/encrypted.service';
import { checkCompany } from '../../../modules/utils/checkCompany';
import { ProductStudioService } from '../product_studio/product-studio.service';
import { ReadProductStudioDto } from '../product_studio/dtos';

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
    private readonly productStudio: ProductStudioService
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

  async create(
    productStudioPhoto: CreateProductStudioPhotoDto,
  ): Promise<ReadProductStudioPhotoDto> {
    this.getProductStudioPhotoRepository();

    let createPhotoStudioPhoto;
    try {
      productStudioPhoto.photos.forEach((element) => {
        
        const newProductStudioPhoto =
        this.productStudioPhotoRepository.create({
           photo: element.image,
           feature_photo: false,
           url: '123456789',
           product_photo_id: {
            id: productStudioPhoto.products_id
           }
        });

        createPhotoStudioPhoto =
         this.productStudioPhotoRepository.save(newProductStudioPhoto);
      });

      console.log(await createPhotoStudioPhoto);
      

      //return;
     
      
      return plainToClass(ReadProductStudioPhotoDto, createPhotoStudioPhoto);
    } catch (err) {
      throw new BadGatewayException(err.message);
    }
  }

  async uploadImages(images, products_id, category, request) {
    this.getProductStudioPhotoRepository();

    const company = await checkCompany(request);    

    const { slug } = await this.productStudio.findById(products_id);    

    let createPhotoStudioPhoto;
    try {
      images['images'].forEach(async (element) => {

      const encryptedImageName = await this.encryptedService.encryptedImageName(element.originalname);
           
      const s3 = await this.awsS3Service.uploadImage(
        company,
        category,
        slug,
        element,
        encryptedImageName
      );      
      
      const newProductStudioPhoto = await this.productStudioPhotoRepository.create({
        photo: encryptedImageName,
        feature_photo: false,
        url:s3,
        product_photo_id: {
          id: products_id,
        },
      });

        createPhotoStudioPhoto =
         this.productStudioPhotoRepository.save(newProductStudioPhoto);
       });

      return plainToClass(ReadProductStudioPhotoDto, createPhotoStudioPhoto);
    } catch (err) {
      throw new BadGatewayException(err.message);
    }
  }

  async setCoverPhoto(request, id: string, data: object) {
    this.getProductStudioPhotoRepository();

    const product = await this.productStudio.findOneProduct(data['productId']);

    product.product_studio_photo.forEach(async (image) => {
        if (image.feature_photo == true) {
          await this.desableCoverPhoto(image.id);
          return;        
        }        
    })    
    
    let image = await this.productStudioPhotoRepository.findOne(id);
    image.feature_photo = data['isCover'];

    return await this.productStudioPhotoRepository.save(image);
  }

  async desableCoverPhoto(id: string): Promise<void> {
    this.getProductStudioPhotoRepository();
    let image = await this.productStudioPhotoRepository.findOne(id);
    image.feature_photo = false;
    await this.productStudioPhotoRepository.save(image);  
  }
}
