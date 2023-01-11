import { PartialType } from '@nestjs/swagger';
import { CreateLinkSharingDto } from './create.dto';

export class ReadLinkSharingDto extends PartialType(CreateLinkSharingDto) {}
