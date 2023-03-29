import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import * as aws from 'aws-sdk';
import * as moment from 'moment';
import { v4 as uuidV4 } from 'uuid';
import { compare, hash } from 'bcryptjs';
import { validate as uuidValidate } from 'uuid';
import { plainToClass, plainToInstance } from 'class-transformer';
import { validationCPF } from 'src/modules/utils/validationsCPF';
import { ILike, Repository } from 'typeorm';
import { TenantProvider } from '../tenant.provider';
import {
  CreatePassword,
  CreateUserDto,
  ReadUserDto,
  UpdateUserDto,
} from './dto';
import { IResponseUserData } from './interface/read-user-pagination';
import { User } from './entities/user.entity';
import { IReadUsersParams } from './interface/get-all-users-params';
import { UserDinamicRepository } from './repositories/users.repositories';
import { ForgotPassword } from './dto/forgot-password.dto';
import { resolve } from 'path';
import { MailsStudioService } from '../mails/mail-studio.service';

//CADA REQUEST QUE SE CHAMA NA APLICAÇÃO ELA VAI CRIAR UMA NOVA INSTANCIA DESSA CLASSE
@Injectable({ scope: Scope.REQUEST })
export class UserService {
  private userRepository: Repository<User>;

  getUserRepository() {
    if (TenantProvider.connection) {
      this.userRepository = TenantProvider.connection.getRepository(User);
    }
  }

  constructor(
    private readonly userDinamicRepository: UserDinamicRepository,
    private readonly mailsService: MailsStudioService,
  ) {
    this.getUserRepository();
  }

  // FUNÇÃO PARA VALIDAR UM USUÁRIO ANTES DE INSERIR NO BANCO
  async validateUser(createUserDto: CreateUserDto) {
    const emailExist = await this.userDinamicRepository.findByEmail(
      createUserDto.email,
    );
    if (emailExist) throw new BadRequestException('O e-mail já está em uso.');

    const validCPF = validationCPF(createUserDto.cpf);
    if (!validCPF) throw new BadRequestException('CPF inválido.');

    const cpfExist = await this.userDinamicRepository.findByCPF(
      createUserDto.cpf,
    );
    if (cpfExist) throw new BadRequestException('CPF já está em uso.');
  }

  // FUNÇÃO PARA BUSCAR TODOS OS USUÁRIOS
  async findAll({
    limit = 15,
    page = 1,
    search,
  }: IReadUsersParams): Promise<IResponseUserData> {
    const where = [];

    if (search) {
      where.push({
        name: ILike(`%${search}%`),
      });

      where.push({
        email: ILike(`%${search}%`),
      });

      where.push({
        cpf: ILike(`%${search}%`),
      });
    }

    this.getUserRepository();
    const [users, count] = await this.userRepository.findAndCount({
      relations: ['address'],
      where,
      order: {
        name: 'ASC',
      },
      take: limit, // aqui pega a quantidade
      skip: (page - 1) * limit,
    });
    return {
      count,
      totalPages: Math.ceil(count / limit),
      data: users.map((user) => {
        delete user.password;
        return plainToClass(ReadUserDto, user);
      }),
    };
  }

  async findAllSystem(): Promise<ReadUserDto[]> {
    this.getUserRepository();
    const users = await this.userRepository.find({
      where: {
        user_type: 'system',
      },
      order: {
        created_at: 'DESC',
      },
    });

    return plainToInstance(ReadUserDto, users);
  }

  async deleteUser(id: string): Promise<boolean> {
    this.getUserRepository();
    const users = await this.userRepository.delete(id);
    if (!users.affected) {
      throw new NotFoundException('Falha ao remover usuário');
    }

    return true;
  }

  // FUNÇÃO PARA BUSCAR UM USUÁRIO
  async findOneUser(user_id: string): Promise<ReadUserDto> {
    this.getUserRepository();
    const user = await this.userRepository.findOne({
      where: { id: user_id },
      relations: ['address', 'products', 'products.product_studio_photo'],
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    delete user.password;
    return plainToClass(ReadUserDto, user);
  }

  // FUNÇÃO PARA CRIAR UM USUÁRIO
  async create(user: CreateUserDto, studio: string): Promise<ReadUserDto> {
    this.getUserRepository();

    try {
      await this.validateUser(user);
      const userCreatted = user.password.length
        ? Object.assign(user, {
            password: await hash(user.password, 8),
            token: uuidV4().replace('-', ''),
            token_isvalid: false,
          })
        : Object.assign(user, {
            token: String(uuidV4()).slice(-12),
            token_isvalid: false,
          });

      const newUser = this.userRepository.create(userCreatted);
      const createdUser = await this.userRepository.save(newUser);
      delete createdUser.password;

      // Se for passado o estúdio no parâmetro da rota ele entra aqui para que o cliente
      // informe a sua senha pelo link enviado ao seu e-mail
      if (studio) {
        const templatePath = resolve(
          __dirname,
          '..',
          '..',
          '..',
          '..',
          'views',
          'emails',
          'generate-password.hbs',
        );

        const nameClient = `${user.name.toUpperCase()} ${user.lastname.toUpperCase()}`;

        const variables = {
          name: nameClient,
          date: moment().format('DD/MM/YYYY'),
          link: `${process.env.URL_PRINCIPAL}/${studio}/${process.env.URL_NEW_PASSWORD}${createdUser.token}&email=${createdUser.email}`,
        };

        await this.mailsService.sendEmail(
          createdUser.email,
          'Criação de senha para acessar o estúdio',
          variables,
          templatePath,
        );

        delete createdUser.token;

        return plainToClass(ReadUserDto, createdUser);
      }

      return plainToClass(ReadUserDto, createdUser);
    } catch (err) {
      throw new BadGatewayException(err.message);
    }
  }

  // FUNÇÃO PARA BUSCAR UM USUÁRIO POR E-MAIL
  async findByEmail(email: string) {
    this.getUserRepository();
    return await this.userRepository.findOne({ where: { email } });
  }

  // FUNÇÃO PARA ATUALIZAR UM USUÁRIO
  async updateProfile(
    id: string,
    profile: UpdateUserDto,
  ): Promise<ReadUserDto> {
    this.getUserRepository();

    if (!uuidValidate(id)) {
      throw new BadRequestException('Id informado não é válido.');
    }

    const userExists = await this.userRepository.findOne({
      where: { id },
    });

    if (!userExists) {
      throw new NotFoundException('Identificador do usuário não encontrado');
    }

    const updateUser = Object.assign(userExists, {
      ...profile,
      password: userExists.password,
    });
    const updateUserProfile = await this.userRepository.save(updateUser);

    delete updateUserProfile.password;

    return plainToInstance(ReadUserDto, updateUserProfile);
  }

  // FUNÇÃO PARA ATUALIZAR UMA SENHA DO USUÁRIO
  async updateProfilePassword(
    id: string,
    passwordInfoOld: string,
    passwordInfoNew: string,
  ): Promise<ReadUserDto> {
    this.getUserRepository();

    if (!uuidValidate(id)) {
      throw new BadRequestException('Id informado não é válido.');
    }

    const userExists = await this.userRepository.findOne({
      where: { id },
    });

    if (!userExists) {
      throw new NotFoundException('Identificador do usuário não encontrado');
    }

    const oldPassword = userExists.password;
    const verifyPassword = await compare(passwordInfoOld, oldPassword);

    if (!verifyPassword) {
      throw new BadRequestException(
        'Senha antiga não comfere com a que já está cadastrada.',
      );
    }

    userExists.password = await hash(passwordInfoNew, 8);
    const updateUserProfile = await this.userRepository.save(userExists);

    delete updateUserProfile.password;

    return plainToInstance(ReadUserDto, updateUserProfile);
  }

  // FUNÇÃO PARA VALIDAR E VERIFICAR UM E-MAIL
  async availableEmail(email: string) {
    const company = await this.userRepository.findOne({
      where: { email: email },
    });
    if (company)
      throw new BadRequestException({
        statusCode: 400,
        message: 'E-mail já em uso.',
        available: false,
      });

    return { available: true };
  }

  // FUNÇÃO PARA RECUPERAR UMA SENHA DO USUÁRIO
  async forgotProfilePassword(
    objectForgotPassword: ForgotPassword,
  ): Promise<boolean> {
    this.getUserRepository();

    const userExists = await this.userRepository.findOne({
      where: { forgot_password: objectForgotPassword.forgot_password },
    });

    if (!userExists) {
      throw new NotFoundException('Código validador inválido.');
    }

    userExists.password = await hash(objectForgotPassword.password, 8);
    const updateUserProfile = await this.userRepository.save(userExists);

    if (updateUserProfile) {
      const resetCodeForgotPassword = Object.assign(userExists, {
        ...userExists,
        forgot_password: null,
      });

      await this.userRepository.save(resetCodeForgotPassword);
    }

    delete updateUserProfile.password;

    return true;
  }

  // FUNÇÃO PARA CRIAR UMA SENHA PARA O CLIENTE
  async generatePassword(
    objectCreatePassword: CreatePassword,
  ): Promise<boolean> {
    this.getUserRepository();

    const userExists = await this.userRepository.findOne({
      where: {
        email: objectCreatePassword.email,
        token: objectCreatePassword.token,
      },
    });

    if (!userExists) {
      throw new NotFoundException(
        'Usuário ou código não cadastrado pelo estúdio.',
      );
    }

    if (userExists.token_isvalid) {
      throw new BadRequestException('Senha já criada para esse link.');
    }

    userExists.password = await hash(objectCreatePassword.password, 8);
    userExists.token_isvalid = true;
    await this.userRepository.save(userExists);

    return true;
  }

  // FUNÇÃO PARA O UPLOAD DO AVATAR
  async uploadAvatar(file, id) {
    const { mimetype } = file;
    const AWS_S3_BUCKET = process.env.AWS_BUCKET;
    const newMimetype = mimetype.split('/')[1];
    const nameImage = `${uuidV4()}.${newMimetype}`;
    let removeImageS3 = null;

    const imgAvatar = await this.userRepository.findOne({
      where: { id: id },
    });

    if (imgAvatar.avatar !== null) {
      removeImageS3 = imgAvatar.avatar.split('profiles/')[1];
    }

    const responseImage = await this.s3_upload(
      file.buffer,
      AWS_S3_BUCKET,
      nameImage,
      file.mimetype,
      removeImageS3,
    );

    return { url: responseImage };
  }

  // FUNÇÃO PARA O PREPARO DO S3
  async s3_upload(file, bucket, name, mimetype, removeImageS3) {
    const params = {
      Bucket: bucket,
      Key: 'profiles/' + String(name),
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
      Key: 'profiles/' + removeImageS3,
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
