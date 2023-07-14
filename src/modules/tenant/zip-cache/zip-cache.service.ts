import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ZipCache } from './entity/zip-cache.entity';
import { TenantProvider } from '../tenant.provider';
import {
  CreateZipCacheImageDto,
  UpdateZipCacheImageDto,
} from './interface/zip-cache.interface';

@Injectable()
export class ZipCacheService {
  private zipCacheRepository: Repository<ZipCache>;

  getZipCacheRepository() {
    if (TenantProvider.connection) {
      this.zipCacheRepository =
        TenantProvider.connection.getRepository(ZipCache);
    }
  }

  constructor() {
    this.getZipCacheRepository();
  }

  async insertZipCache(zipCacheObject: CreateZipCacheImageDto) {
    try {
      this.getZipCacheRepository();

      const zipCacheUpdade = await this.zipCacheRepository.save(zipCacheObject);
      return zipCacheUpdade;
    } catch (err) {
      throw new InternalServerErrorException(
        'Falha ao criar  o cache das imagens',
      );
    }
  }

  async updateZipCache(id: string, zipCacheDto: UpdateZipCacheImageDto) {
    try {
      this.getZipCacheRepository();

      return this.zipCacheRepository.update({ id }, zipCacheDto);
    } catch (err) {
      throw new InternalServerErrorException(
        'Falha ao criar ou atualizar o cache do zip das imagens',
      );
    }
  }

  async insertUrlInZipCache(idCache: string, url: string) {
    this.getZipCacheRepository();

    const zipCache = await this.zipCacheRepository.findOne({
      where: {
        id: idCache,
      },
    });

    const zipCacheData = Object.assign(zipCache, {
      ...zipCache,
      url,
    });

    if (zipCache) {
      await this.zipCacheRepository.save(zipCacheData);
    }
  }

  async getProgressZipCacheAndUrl(id: string) {
    this.getZipCacheRepository();
    const zipCacheUpdate = await this.zipCacheRepository.findOne({
      where: { id },
    });

    return zipCacheUpdate;
  }
}
