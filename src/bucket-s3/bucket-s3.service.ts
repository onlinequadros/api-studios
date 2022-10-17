import { BadRequestException, Injectable } from '@nestjs/common';
import { config, S3 } from 'aws-sdk';
import { MessagesHelper } from '../helpers/messages.helpers';
import { v4 as uuidv4 } from 'uuid';
import { EncryptedService } from '../modules/utils/encrypted.service';

@Injectable()
export class BucketS3Service {
  private readonly s3;
  private readonly region;
  constructor(private readonly encryptedService: EncryptedService) {
    this.region = process.env.AWS_REGION || '';
    // Set the Region
    //AWS.config.update({region: this.region});
    config.getCredentials(function (err) {
      if (err) console.log(err.stack);
      // credentials not loaded
      else {
        console.log('AWS credentials:', config.credentials);
      }
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

  async s3Upload( company, category, buffer, originalname, mimetype) {
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: `${company}/${category}/${originalname}`,
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
    } catch (e) {
      throw new BadRequestException(MessagesHelper.S3_FAILED_UPLOAD_IMAGE, e);
    }
  }

  async createFolderS3Bucket(tenantCompany: string) {
    const bucketParams = {
      Bucket: process.env.AWS_BUCKET,
      Key: `${tenantCompany}/`,
    };

    try {
      const response = await this.s3.putObject(bucketParams).promise();
      return response.Location;
    } catch (error) {
      throw new BadRequestException(
        MessagesHelper.S3_FAILED_TO_CREATE_FOLDER,
        error.stack,
      );
    }
  }

  async createFolderCategoriesS3Bucket(
    tenancyCompany: string,
    category: string,
  ) {
    const bucketParams = {
      Bucket: process.env.AWS_BUCKET,
      Key: `${tenancyCompany}/${category}`,
    };

    try {
      const response = await this.s3.putObject(bucketParams).promise();
      return response.Location;
    } catch (error) {
      throw new BadRequestException(
        MessagesHelper.S3_FAILED_CREATE_FOLDER_CATEGORY,
        error.stack,
      );
    }
  }
}
