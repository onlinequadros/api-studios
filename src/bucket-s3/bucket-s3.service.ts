import { BadRequestException, Injectable } from '@nestjs/common';
import { config, S3 } from 'aws-sdk';
import { MessagesHelper } from '../helpers/messages.helpers';

@Injectable()
export class BucketS3Service {
  private readonly s3;
  constructor() {
    config.getCredentials(function (err) {
      if (err) console.log(err.stack);
    });
    this.s3 = new S3();
  }

  async uploadImage(company, category, image, encryptedName) {
    const { buffer, mimetype } = image;

    const s3 = await this.s3Upload(
      company,
      category,
      buffer,
      encryptedName,
      mimetype,
    );

    return s3;
  }

  async s3Upload(company, category, buffer, originalname, mimetype) {
    const key = company + '/' + category + '/' + originalname;
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: key,
      Body: buffer,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'ap-south-1',
      },
    };

    try {
      const s3Response = await this.s3.upload(params).promise();
      return s3Response.Location;
    } catch (error) {
      throw new BadRequestException(MessagesHelper.FAILED_UPLOAD_IMAGE, error);
    }
  }

  async createCompanyFolder(company: string) {
    const key = company + '/';
    return await this.createFolder(key);
  }

  async createCategoryFolder(company: string, category: string) {
    const key = company + '/' + category + '/';
    return await this.createFolder(key);
  }

  async createProductFolder(company: string, category: string, title: string) {
    let product;
    product = title.toLowerCase();
    product = product.split(' ').join('-');

    const key = company + '/' + category + '/' + product + '/';
    return await this.createFolder(key);
  }

  async deleteProductFolder(
    company: string,
    category: string,
    product: string,
  ) {
    const key = company + '/' + category + '/' + product + '/';
    return await this.deleteFolder(key);
  }

  async deleteCategoryFolder(company: string, category: string) {
    const key = company + '/' + category + '/';
    return await this.deleteFolder(key);
  }
  async deleteCompanyFolder(company: string) {
    const key = company + '/';
    return await this.deleteFolder(key);
  }

  async createFolder(key: string) {
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: `${key}`,
    };

    try {
      const response = await this.s3.putObject(params).promise();
      return response.Location;
    } catch (error) {
      throw new BadRequestException(
        MessagesHelper.FAILED_TO_CREATE_FOLDER,
        error.stack,
      );
    }
  }

  async deleteFolder(key: string) {
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: `${key}`,
    };

    try {
      const response = await this.s3.deleteObject(params).promise();
      return response.Location;
    } catch (error) {
      throw new BadRequestException(
        MessagesHelper.FAILED_REMOVED_FOLDER,
        error.stack,
      );
    }
  }
}
