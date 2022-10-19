import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { BucketS3Service } from './bucket-s3.service';

@Controller('bucket-s3')
export class BucketS3Controller {
  constructor(private readonly s3Service: BucketS3Service) {}

  @Post()
  async createCompanyFolder(@Body() company: object) {
    return await this.s3Service.createCompanyFolder(company['company']);
  }

  @Post('/category')
  async createCategoryFolder(@Body() object: object) {
    return await this.s3Service.createCategoryFolder(
      object['company'],
      object['category'],
    );
  }

  @Post('/category/product')
  async createProductFolder(@Body() object: object) {
    return await this.s3Service.createProductFolder(
      object['company'],
      object['category'],
      object['title'],
    );
  }

  @Delete(':company/:category/:product')
  async deleteProductFolder(
    @Param('company') company: string,
    @Param('category') category: string,
    @Param('product') product: string,
  ) {
    return await this.s3Service.deleteProductFolder(company, category, product)
  }

  @Delete(':company')
  async deleteCompanyFolder(@Param('company') company: string) {
    return await this.s3Service.deleteCompanyFolder(company);
  }

  @Delete(':company/:category')
  async deleteCategoryFolder(
    @Param('company') company: string,
    @Param('category') category: string,
  ) {
    return await this.s3Service.deleteCategoryFolder(company, category);
  }
}
