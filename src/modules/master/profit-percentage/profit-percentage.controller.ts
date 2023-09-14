import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { ProfitPercentageService } from './profit-percentage.service';
import { CreateProfitPercentageDto } from './dto/create-profit-percentage.dto';
import { UpdateProfitPercentageDto } from './dto/update-profit-percentage.dto';

@Controller('profit-percentage')
export class ProfitPercentageController {
  constructor(
    private readonly profitPercentageService: ProfitPercentageService,
  ) {}

  @Post()
  async create(@Body() createProfitPercentageDto: CreateProfitPercentageDto) {
    return this.profitPercentageService.create(createProfitPercentageDto);
  }

  @Get()
  async findAll() {
    return this.profitPercentageService.find();
  }

  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() updateProfitPercentageDto: UpdateProfitPercentageDto,
  ) {
    return this.profitPercentageService.update(id, updateProfitPercentageDto);
  }
}
