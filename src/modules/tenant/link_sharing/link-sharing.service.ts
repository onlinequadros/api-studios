import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomInt } from 'crypto';
import { Repository } from 'typeorm';
import { TenantProvider } from '../tenant.provider';
import { CreateLinkSharingDto } from './dtos';
import { LinkSharing } from './entity/link-sharing.entity';
import { ProductStudio } from '../product_studio/entity/product-studio.entity';

//CADA REQUEST QUE SE CHAMA NA APLICAÇÃO ELA VAI CRIAR UMA NOVA INSTANCIA DESSA CLASSE
@Injectable()
export class LinkSharingService {
  private linkSharingRepository: Repository<LinkSharing>;
  private productStudioRepository: Repository<ProductStudio>;

  getProductStudioRepository() {
    if (TenantProvider.connection) {
      this.linkSharingRepository =
        TenantProvider.connection.getRepository(LinkSharing);
    }

    if (TenantProvider.connection) {
      this.productStudioRepository =
        TenantProvider.connection.getRepository(ProductStudio);
    }
  }

  constructor() {
    this.getProductStudioRepository();
  }

  // FUNÇÃO PARA BUSCAR UM LINK
  async findOneLink(slug: string): Promise<{ link: string }> {
    this.getProductStudioRepository();
    const linkSharing = await this.linkSharingRepository.findOne({
      where: { slug },
    });

    if (!linkSharing) {
      throw new NotFoundException('Link não encontrado.');
    }

    const linkGenerated = `${linkSharing.link}/${linkSharing.studio}/${linkSharing.slug}/register/${linkSharing.code}`;

    return { link: linkGenerated };
  }

  // FUNÇÃO PARA BUSCAR O CÓDIGO DO LINK NO STUDIO
  async findOneLinkPerCode(slug: string): Promise<{ code: string }> {
    this.getProductStudioRepository();
    const linkSharing = await this.linkSharingRepository.findOne({
      where: { slug },
    });

    if (!linkSharing) {
      return { code: '0' };
    }

    return { code: linkSharing.code };
  }

  // FUNÇÃO PARA CRIAR UM LINK
  async create(dataLink: CreateLinkSharingDto): Promise<{ link: string }> {
    this.getProductStudioRepository();

    const variables = {
      code: String(randomInt(1000000000, 9999999999)),
    };

    // Pega o id do produto para colocar junto com o código
    const product = await this.productStudioRepository.findOne({
      where: { slug: dataLink.slug },
      select: ['id'],
    });

    const objectDataLink = {
      link: dataLink.link,
      studio: dataLink.studio,
      slug: dataLink.slug,
      code: `${variables.code}#${product.id}`,
    };

    try {
      const newLinkSharing = this.linkSharingRepository.create(objectDataLink);
      const createdLink = await this.linkSharingRepository.save(newLinkSharing);

      const linkGenerated = `${createdLink.link}/${createdLink.studio}/${createdLink.slug}/register/${createdLink.code}`;

      return { link: linkGenerated };
    } catch (err) {
      throw new BadGatewayException(err.message);
    }
  }
}
