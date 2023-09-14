import { PartialType } from '@nestjs/swagger';
import { CreateProfitPercentageDto } from './create-profit-percentage.dto';

export class UpdateProfitPercentageDto extends PartialType(
  CreateProfitPercentageDto,
) {}
