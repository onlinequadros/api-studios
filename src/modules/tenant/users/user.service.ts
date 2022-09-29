import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { hash } from 'bcryptjs';
import { plainToClass, plainToInstance } from 'class-transformer';
import { validationCPF } from 'src/modules/utils/validationsCPF';
import { ILike, Repository } from 'typeorm';
import { TenantProvider } from '../tenant.provider';
import { CreateUserDto, ReadUserDto } from './dto';
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
      relations: ['address'],
    });
    delete user.password;
    return plainToClass(ReadUserDto, user);
  }

  // FUNÇÃO PARA CRIAR UM USUÁRIO
  async create(user: CreateUserDto): Promise<ReadUserDto> {
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
    return await this.userRepository.findOne({ where: { email } });
  }
}
