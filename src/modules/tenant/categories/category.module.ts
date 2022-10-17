import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CompaniesModule } from 'src/modules/master/companies/companies.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { BucketS3Service } from '../../../bucket-s3/bucket-s3.service';
import { EncryptedService } from '../../../modules/utils/encrypted.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), CompaniesModule],
  controllers: [CategoryController],
  providers: [CategoryService, BucketS3Service, EncryptedService],
  exports: [CategoryService],
})
export class CategoryModule {}
