import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import * as aws from 'aws-sdk';
import { compare, hash } from 'bcryptjs';
import { validate as uuidValidate } from 'uuid';
import { plainToClass, plainToInstance } from 'class-transformer';
import { validationCPF } from 'src/modules/utils/validationsCPF';
import { ILike, Repository } from 'typeorm';
import { TenantProvider } from '../tenant.provider';
import { CreateUserDto, ReadUserDto, UpdateUserDto } from './dto';
import { IResponseUserData } from './interface/read-user-pagination';
import { User } from './entities/user.entity';
import { IReadUsersParams } from './interface/get-all-users-params';
import { UserDinamicRepository } from './repositories/users.repositories';

//CADA REQUEST QUE SE CHAMA NA APLICAÇÃO ELA VAI CRIAR UMA NOVA INSTANCIA DESSA CLASSE
@Injectable({ scope: Scope.REQUEST })
export class UserService {
  private userRepository: Repository<User>;

  getUserRepository() {
    if (TenantProvider.connection) {
      this.userRepository = TenantProvider.connection.getRepository(User);
    }
  }

  constructor(private readonly userDinamicRepository: UserDinamicRepository) {
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
  async create(user: CreateUserDto): Promise<ReadUserDto> {
    this.getUserRepository();
    try {
      await this.validateUser(user);
      const userCreatted = Object.assign(user, {
        password: await hash(user.password, 8),
      });

      const newUser = this.userRepository.create(userCreatted);
      const createdUser = await this.userRepository.save(newUser);
      delete createdUser.password;
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

  // FUNÇÃO PARA O UPLOAD DO AVATAR
  async uploadAvatar(file) {
    const { originalname } = file;
    const AWS_S3_BUCKET = process.env.AWS_BUCKET;

    const responseImage = await this.s3_upload(
      file.buffer,
      AWS_S3_BUCKET,
      originalname,
      file.mimetype,
    );

    return { url: responseImage };
  }

  // FUNÇÃO PARA O PREPARO DO S3
  async s3_upload(file, bucket, name, mimetype) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'ap-south-1',
      },
    };

    const s3 = new aws.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    try {
      const s3Response = await s3.upload(params).promise();
      return s3Response.Location;
    } catch (e) {
      throw new BadRequestException('Falha ao realizar o upload.' + e);
    }
  }
}
