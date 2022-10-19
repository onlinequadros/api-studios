import { Injectable, Scope } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BucketS3Service } from '../../../bucket-s3/bucket-s3.service';
import { Repository } from 'typeorm';
import { TenantProvider } from '../tenant.provider';
import { CreateCategoryDto, ReadCategoryDto } from './dto';
import { Category } from './entities/category.entity';
import { checkCompany } from '../../../modules/utils/checkCompany';

//CADA REQUEST QUE SE CHAMA NA APLICAÇÃO ELA VAI CRIAR UMA NOVA INSTANCIA DESSA CLASSE
@Injectable({ scope: Scope.REQUEST })
export class CategoryService {
  private categoryRepository: Repository<Category>;

  constructor(private readonly s3Service: BucketS3Service) {
    if (TenantProvider.connection) {
      this.categoryRepository =
        TenantProvider.connection.getRepository(Category);
    }
  }

  async findAll(): Promise<ReadCategoryDto[]> {
    this.categoryRepository = TenantProvider.connection.getRepository(Category);
    const categories = await this.categoryRepository.find();
    return categories.map((category) =>
      plainToInstance(ReadCategoryDto, category),
    );
  }

  async create(request, category: CreateCategoryDto): Promise<ReadCategoryDto> {
    
    const { name } = category;
    const company = await checkCompany(request);

    this.categoryRepository = TenantProvider.connection.getRepository(Category);
    const newCategory = this.categoryRepository.create(category);
    const createdCategory = await this.categoryRepository.save(newCategory);

    await this.s3Service.createCategoryFolder(company, name);
    return plainToInstance(ReadCategoryDto, createdCategory);
  }

  async delete(request, id) {
    this.categoryRepository = TenantProvider.connection.getRepository(Category);
    const company = await checkCompany(request);

    const { name } = await this.categoryRepository.findOne({
      id:id
    });

    const category = this.categoryRepository.delete({
      id: id
    });

    await this.s3Service.deleteCategoryFolder(company, name);

    return category;
  }
}
