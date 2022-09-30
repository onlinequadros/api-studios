import { PartialType } from '@nestjs/swagger';
import { CreateProductArtistDto } from './create.dto';

export class ReadProductArtistDto extends PartialType(CreateProductArtistDto) {}
