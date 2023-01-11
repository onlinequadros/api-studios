import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateLinkSharingDto, ReadLinkSharingDto } from './dtos';
import { LinkSharingService } from './link-sharing.service';

@Controller('link-sharing')
export class LinkSharingController {
  constructor(private readonly linkSharingService: LinkSharingService) {}

  @Get('/:slug/:code')
  // @UseGuards(JwtAuthGuard)
  async findOne(
    @Param('slug') slug: string,
    @Param('code') code: string,
  ): Promise<ReadLinkSharingDto> {
    return this.linkSharingService.findOneLink(slug, code);
  }

  @Post()
  // @UseGuards(JwtAuthGuard)
  async create(
    @Body() data: CreateLinkSharingDto,
  ): Promise<ReadLinkSharingDto> {
    return this.linkSharingService.create(data);
  }
}
