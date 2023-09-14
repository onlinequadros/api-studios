import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfitPercentage } from './entities/profitpercentage.entity';
import { CreateProfitPercentageDto } from './dto/create-profit-percentage.dto';
import { UpdateProfitPercentageDto } from './dto/update-profit-percentage.dto';

@Injectable()
export class ProfitPercentageService {
  constructor(
    @InjectRepository(ProfitPercentage)
    private readonly repository: Repository<ProfitPercentage>,
  ) {}

  async find(): Promise<ProfitPercentage> {
    const profit = await this.repository.find();

    if (!profit) {
      throw new NotFoundException(
        'Valores de desconto e comissão não encontrados.',
      );
    }

    return profit[0];
  }

  async create(
    createProfitPercentage: CreateProfitPercentageDto,
  ): Promise<ProfitPercentage> {
    const newPercentageFormated = {
      photographer_commission:
        createProfitPercentage.photographer_commission / 100,
      owner_commission: createProfitPercentage.owner_commission / 100,
    };

    const verifyProfit = await this.find();
    if (verifyProfit) {
      throw new BadRequestException('Os valores já foram criados.');
    }

    const profit = this.repository.create(newPercentageFormated);
    return this.repository.save(profit);
  }

  async update(
    id: string,
    updateProfitPercentage: UpdateProfitPercentageDto,
  ): Promise<UpdateProfitPercentageDto> {
    const profit = await this.repository.findOne({ where: { id } });

    if (!profit) {
      throw new NotFoundException('Valores de porcentagem não encontrado.');
    }

    const newPercentageFormated = {
      photographer_commission:
        updateProfitPercentage.photographer_commission / 100,
      owner_commission: updateProfitPercentage.owner_commission / 100,
    };

    const newProfit = Object.assign(profit, newPercentageFormated);
    return this.repository.save(newProfit);
  }
}
