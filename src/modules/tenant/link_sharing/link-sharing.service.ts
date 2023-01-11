import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { TenantProvider } from '../tenant.provider';
import { CreateLinkSharingDto, ReadLinkSharingDto } from './dtos';
import { LinkSharing } from './entity/link-sharing.entity';

//CADA REQUEST QUE SE CHAMA NA APLICAÇÃO ELA VAI CRIAR UMA NOVA INSTANCIA DESSA CLASSE
@Injectable()
export class LinkSharingService {
  private linkSharingRepository: Repository<LinkSharing>;

  getProductStudioRepository() {
    if (TenantProvider.connection) {
      this.linkSharingRepository =
        TenantProvider.connection.getRepository(LinkSharing);
    }
  }

  constructor() {
    this.getProductStudioRepository();
  }

  // FUNÇÃO PARA BUSCAR UM LINK
  async findOneLink(slug: string, code: string): Promise<ReadLinkSharingDto> {
    this.getProductStudioRepository();
    const linkSharing = await this.linkSharingRepository.findOne({
      where: { code, slug },
    });

    if (!linkSharing) {
      throw new NotFoundException('Link não encontrado.');
    }

    return plainToInstance(ReadLinkSharingDto, linkSharing);
  }

  // FUNÇÃO PARA CRIAR UM LINK
  async create(dataLink: CreateLinkSharingDto): Promise<ReadLinkSharingDto> {
    this.getProductStudioRepository();

    try {
      const newLinkSharing = this.linkSharingRepository.create(dataLink);
      const createdLink = await this.linkSharingRepository.save(newLinkSharing);

      return plainToInstance(ReadLinkSharingDto, createdLink);
    } catch (err) {
      throw new BadGatewayException(err.message);
    }
  }
}
