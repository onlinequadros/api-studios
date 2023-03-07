import { PartialType } from '@nestjs/swagger';
import { CreateWalletDto } from './create.dto';

export class ReadWalletDto extends PartialType(CreateWalletDto) {}
