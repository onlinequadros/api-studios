import { Injectable, Scope } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { TenantProvider } from '../tenant.provider';
import { CreateCategoryDto, ReadCategoryDto } from './dto';
import { Category } from './entities/category.entity';

//CADA REQUEST QUE SE CHAMA NA APLICAÇÃO ELA VAI CRIAR UMA NOVA INSTANCIA DESSA CLASSE
@Injectable({ scope: Scope.REQUEST })
export class CategoryService {
  private categoryRepository: Repository<Category>;

  constructor() {
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

  async create(category: CreateCategoryDto): Promise<ReadCategoryDto> {
    this.categoryRepository = TenantProvider.connection.getRepository(Category);
    const newCategory = this.categoryRepository.create(category);
    const createdCategory = await this.categoryRepository.save(newCategory);

    return plainToInstance(ReadCategoryDto, createdCategory);
  }
}
