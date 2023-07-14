import { Module } from '@nestjs/common';
import { ZipCacheController } from './zip-cache.controller';
import { ZipCacheService } from './zip-cache.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZipCache } from './entity/zip-cache.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ZipCache])],
  controllers: [ZipCacheController],
  providers: [ZipCacheService],
  exports: [ZipCacheService],
})
export class ZipCacheModule {}
