import { PartialType } from '@nestjs/swagger';
import { CreateProductStudioDto } from './create.dto';

export class ReadProductStudioDto extends PartialType(CreateProductStudioDto) {}
