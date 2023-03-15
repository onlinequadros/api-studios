import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import * as aws from 'aws-sdk';
import { v4 as uuidV4 } from 'uuid';
import { CreateClientDto, ReadClientDto } from './dto';
import { Client } from './entities/client.entity';
import { TenantProvider } from '../tenant.provider';
import { ClientRepository } from './repository/client.repository';
import { UpdateClientDTO } from './dto/updateClient.dto';
import { AccountBankData } from './interfaces';

//CADA REQUEST QUE SE CHAMA NA APLICAÇÃO ELA VAI CRIAR UMA NOVA INSTANCIA DESSA CLASSE

@Injectable({ scope: Scope.REQUEST })
export class ClientService {
  private clientConnectionRepository: Repository<Client>;

  getConnectionClient = () => {
    if (TenantProvider.connection) {
      this.clientConnectionRepository =
        TenantProvider.connection.getRepository(Client);
    }
  };

  constructor(private readonly clientRepository: ClientRepository) {}

  // RETORNA TODAS AS INFORMAÇÕES DO CLIENT
  async findAll(): Promise<ReadClientDto[]> {
    this.getConnectionClient();
    const clients = await this.clientConnectionRepository.find();
    return clients.map((client) => {
      delete client.password;
      return plainToClass(ReadClientDto, client);
    });
  }

  // FAZ O GET NA TABELA RETORNANDO SOMENTE O SEGMENT
  async findSegment(): Promise<{ segment: string }> {
    this.getConnectionClient();
    const clients = await this.clientConnectionRepository.find();
    return { segment: clients?.[0].segment };
  }

  // RETORNA OS DADOS BANCÁRIOS DO CLIENTE
  async findAccountClient(): Promise<AccountBankData[]> {
    this.getConnectionClient();
    const clients = await this.clientConnectionRepository.find({
      select: [
        'id',
        'type_account_bank',
        'name_bank',
        'agency_bank',
        'digit_agency_bank',
        'account_bank',
        'digit_account_bank',
        'account_pix_bank',
      ],
    });

    return clients;
  }

  // RETORNA OS DADOS BANCÁRIOS DO CLIENTE
  async updateAccountClient(
    account: AccountBankData,
  ): Promise<AccountBankData> {
    this.getConnectionClient();
    const clients = await this.clientConnectionRepository.findOne({
      where: { id: account.id },
    });

    if (!clients) {
      throw new NotFoundException('Cliente não encontrado');
    }

    const newAccountClient = Object.assign(clients, {
      ...clients,
      type_account_bank: account.type_account_bank,
      name_bank: account.name_bank,
      agency_bank: account.agency_bank,
      digit_agency_bank: account.digit_agency_bank,
      account_bank: account.account_bank,
      digit_account_bank: account.digit_account_bank,
      account_pix_bank: account.account_pix_bank,
    });

    const updateAccountClient = await this.clientConnectionRepository.save(
      newAccountClient,
    );

    const responseAccountClient: AccountBankData = {
      id: updateAccountClient.id,
      type_account_bank: updateAccountClient.type_account_bank,
      name_bank: updateAccountClient.name_bank,
      agency_bank: updateAccountClient.agency_bank,
      digit_agency_bank: updateAccountClient.digit_agency_bank,
      account_bank: updateAccountClient.digit_agency_bank,
      digit_account_bank: updateAccountClient.digit_account_bank,
      account_pix_bank: updateAccountClient.account_pix_bank,
    };

    return responseAccountClient;
  }

  // CRIA UM CLIENT
  async create(client: CreateClientDto): Promise<ReadClientDto> {
    this.getConnectionClient();
    const createdUser = await this.clientConnectionRepository.save(client);

    return plainToClass(ReadClientDto, createdUser);
  }

  // ATUALIZA UM CLIENT
  async update(
    id: string,
    updateClientDTO: UpdateClientDTO,
  ): Promise<ReadClientDto> {
    this.getConnectionClient();

    const clientExists = await this.clientRepository.fincClient(id);

    if (!clientExists) {
      throw new NotFoundException('Client não encontrado');
    }

    const objectClientUpdate = Object.assign(clientExists, updateClientDTO);

    const createdUser = await this.clientConnectionRepository.save(
      objectClientUpdate,
    );

    return plainToClass(ReadClientDto, createdUser);
  }

  // FUNÇÃO PARA O UPLOAD DO AVATAR
  async uploadCover(file, id) {
    this.getConnectionClient();
    const { mimetype } = file;
    const AWS_S3_BUCKET = process.env.AWS_BUCKET;
    const newMimetype = mimetype.split('/')[1];
    const nameImage = `${uuidV4()}.${newMimetype}`;
    let removeImageS3 = null;

    const imgCover = await this.clientConnectionRepository.findOne({
      where: { id: id },
    });

    if (imgCover.cover !== null) {
      removeImageS3 = imgCover.cover.split('cover/')[1];
    }

    const responseImage = await this.s3_upload(
      file.buffer,
      AWS_S3_BUCKET,
      nameImage,
      file.mimetype,
      removeImageS3,
    );

    const preparedCover = Object.assign(imgCover, {
      ...imgCover,
      cover: responseImage,
    });
    await this.clientConnectionRepository.save(preparedCover);

    return { url: responseImage };
  }

  // FUNÇÃO PARA O PREPARO DO S3
  async s3_upload(file, bucket, name, mimetype, removeImageS3) {
    const params = {
      Bucket: bucket,
      Key: 'cover/' + String(name),
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'ap-south-1',
      },
    };

    const paramsRemoveImageS3 = {
      Bucket: bucket,
      Key: 'cover/' + removeImageS3,
    };

    const s3 = new aws.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    try {
      const s3Response = await s3.upload(params).promise();
      if (removeImageS3 !== null) {
        await s3.deleteObject(paramsRemoveImageS3).promise();
      }
      return s3Response.Location;
    } catch (e) {
      throw new BadRequestException('Falha ao realizar o upload.' + e);
    }
  }
}
