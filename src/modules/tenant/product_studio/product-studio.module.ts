import { Module, Scope } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BucketS3Service } from '../../../bucket-s3/bucket-s3.service';
import { ProductStudio } from './entity/product-studio.entity';
import { ProductStudioController } from './product-studio.controller';
import { ProductStudioService } from './product-studio.service';
import { ProductStudioDinamicRepository } from './repositories/product-studio.repository';
import { ScheduleModule } from '@nestjs/schedule';
import { CompaniesModule } from 'src/modules/master/companies/companies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductStudio]),
    ScheduleModule.forRoot(),
    CompaniesModule,
  ],
  controllers: [ProductStudioController],
  providers: [
    ProductStudioService,
    BucketS3Service,
    ProductStudioDinamicRepository,
  ],
  exports: [ProductStudioService, ProductStudioDinamicRepository],
})
export class ProductStudioModule {}
