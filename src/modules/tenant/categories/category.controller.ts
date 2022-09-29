import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, ReadCategoryDto } from './dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoriesService: CategoryService) {}

  @Get()
  async findAll(): Promise<ReadCategoryDto[]> {
    return this.categoriesService.findAll();
  }

  @Post()
  async create(@Body() category: CreateCategoryDto): Promise<ReadCategoryDto> {
    return this.categoriesService.create(category);
  }
}
