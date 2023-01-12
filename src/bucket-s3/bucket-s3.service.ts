import { BadRequestException, Injectable } from '@nestjs/common';
import { config, S3 } from 'aws-sdk';
import { MessagesHelper } from '../helpers/messages.helpers';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const AmazonS3URI = require('amazon-s3-uri');
import * as archiver from 'archiver';
import * as fs from 'fs';

@Injectable()
export class BucketS3Service {
  private readonly s3;
  constructor() {
    config.getCredentials(function (err) {
      if (err) console.log(err.stack);
    });
    this.s3 = new S3();
  }

  async uploadImage(company, category, product, image, encryptedName) {
    const { buffer, mimetype } = image;

    const s3 = await this.s3Upload(
      company,
      category,
      buffer,
      product,
      encryptedName,
      mimetype,
    );

    return s3;
  }

  async s3Upload(company, category, buffer, product, originalname, mimetype) {
    const key = company + '/' + category + '/' + product + '/' + originalname;
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

  async deleteImages(images) {
    const objects = images.map((key) => ({ Key: key }));
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Delete: {
        Objects: objects,
      },
    };
    try {
      const response = await this.s3.deleteObjects(params).promise();
      return response.data;
    } catch (error) {
      throw new BadRequestException(
        MessagesHelper.FAILED_REMOVE_IMAGES,
        error.stack,
      );
    }
  }

  private async getObject(outputDir: string, uri: string, fileName: string) {
    try {
      const { bucket, key } = AmazonS3URI(uri);
      if (bucket && key) {
        const params = {
          Bucket: bucket,
          Key: key,
        };
        const readStream = this.s3.getObject(params).createReadStream();
        return new Promise((resolve, reject) => {
          fs.mkdirSync(`tmp/${outputDir}`, { recursive: true });
          const writeStream = fs.createWriteStream(
            `tmp/${outputDir}/${fileName}`,
          );
          readStream.pipe(writeStream);
          writeStream.on('error', (e) => reject(e));
          writeStream.on('close', (data) => {
            resolve(data);
          });
        });
      }
    } catch (error) {
      throw new BadRequestException(
        MessagesHelper.FAILED_GET_FILE,
        error.stack,
      );
    }
  }

  async zipFiles(outputDir: string, files: Array<Record<string, any>>) {
    for (const file of files) {
      await this.getObject(outputDir, file.url, file.name || file.photo);
    }
    await this.zipDirectory(`tmp/${outputDir}`);
    const path = await this.uploadLocalFileToBucket(
      `zip/photos/photos-${new Date().getTime()}`,
      `tmp/${outputDir}.zip`,
    );
    return this.getSignedUrl(path);
  }

  public async getSignedUrl(file: string) {
    const bucketParams = {
      Key: file,
      Bucket: process.env.AWS_BUCKET,
      Expires: 604800,
    };
    return this.s3.getSignedUrlPromise('getObject', bucketParams);
  }

  private async zipDirectory(sourceDir: string, outPath?: string) {
    if (!outPath) outPath = sourceDir;
    const archive = archiver('zip', { zlib: { level: 2 } });
    const stream = fs.createWriteStream(`${outPath}.zip`);
    return new Promise((resolve, reject) => {
      archive
        .directory(sourceDir, false)
        .on('error', (err) => reject(err))
        .pipe(stream);
      stream.on('close', (data) => {
        resolve(data);
      });
      archive.finalize();
    });
  }

  public async uploadLocalFileToBucket(
    outputPath: string,
    sourcePath: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const file = [];
      const readStream = fs.createReadStream(sourcePath);
      readStream
        .on('data', (data) => {
          file.push(data);
        })
        .on('close', () => {
          const params = {
            Bucket: process.env.AWS_BUCKET,
            Key: outputPath,
            Body: Buffer.concat(file),
          };
          this.s3
            .upload(params)
            .promise()
            .then(() => readStream.resume());
          resolve(outputPath);
        })
        .on('error', (e) => {
          reject(e);
        });
    });
  }
}
