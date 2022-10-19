import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, ReadCategoryDto } from './dto';
import {Request} from 'express';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoriesService: CategoryService) {}

  @Get()
  async findAll(): Promise<ReadCategoryDto[]> {
    return this.categoriesService.findAll();
  }

  @Post()
  async create(@Body() category: CreateCategoryDto, @Req() request: Request): Promise<ReadCategoryDto> {
    return this.categoriesService.create(request, category);
  }

  @Delete(':id') 
  async delete(@Param('id') id: string, @Req() request: Request) {
    return await this.categoriesService.delete(request, id);
  }
}
