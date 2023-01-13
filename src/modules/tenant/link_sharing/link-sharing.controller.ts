import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateLinkSharingDto } from './dtos';
import { LinkSharingService } from './link-sharing.service';

@Controller('link-sharing')
export class LinkSharingController {
  constructor(private readonly linkSharingService: LinkSharingService) {}

  @Get('/:slug')
  // @UseGuards(JwtAuthGuard)
  async findOne(@Param('slug') slug: string): Promise<{ link: string }> {
    return this.linkSharingService.findOneLink(slug);
  }

  @Get('/code/:slug')
  // @UseGuards(JwtAuthGuard)
  async findOneCode(@Param('slug') slug: string): Promise<{ code: string }> {
    return this.linkSharingService.findOneLinkPerCode(slug);
  }

  @Post()
  // @UseGuards(JwtAuthGuard)
  async create(@Body() data: CreateLinkSharingDto): Promise<{ link: string }> {
    return this.linkSharingService.create(data);
  }
}
