import { Controller, Get, Param } from '@nestjs/common';
import { ZipCacheService } from './zip-cache.service';

@Controller('zipcache')
export class ZipCacheController {
  constructor(private readonly zipCachService: ZipCacheService) {}

  @Get('/:id')
  async getProgressZipCacheAndUrl(@Param('id') id: string) {
    return this.zipCachService.getProgressZipCacheAndUrl(id);
  }
}
