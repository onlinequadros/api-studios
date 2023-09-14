import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfitPercentage } from './entities/profitpercentage.entity';
import { ProfitPercentageController } from './profit-percentage.controller';
import { ProfitPercentageService } from './profit-percentage.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProfitPercentage])],
  controllers: [ProfitPercentageController],
  providers: [ProfitPercentageService],
})
export class ProfitPercentageModule {}
