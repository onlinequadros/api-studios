import { PartialType } from '@nestjs/mapped-types';
import { CreateProductStudioDto } from "./create.dto";

export class UpdateProductStudioDTO extends PartialType(CreateProductStudioDto) {}