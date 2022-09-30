import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductStudio } from './entity/product-studio.entity';
import { ProductStudioController } from './product-studio.controller';
import { ProductStudioService } from './product-studio.service';
import { ProductStudioDinamicRepository } from './repositories/product-studio.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductStudio])],
  controllers: [ProductStudioController],
  providers: [ProductStudioService, ProductStudioDinamicRepository],
  exports: [ProductStudioService, ProductStudioDinamicRepository],
})
export class ProductStudioModule {}
