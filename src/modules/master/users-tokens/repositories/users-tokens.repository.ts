import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserTokenDto } from '../dto/create-user-token.dto';
import { UserToken } from '../entities/user-token.entity';

@Injectable()
export class UsersTokensRepository {
  constructor(
    @InjectRepository(UserToken)
    private readonly repository: Repository<UserToken>,
  ) {}

  async create(createUserTokenDto: CreateUserTokenDto): Promise<UserToken> {
    const user_token = this.repository.create(createUserTokenDto);

    await this.repository.save(user_token);

    return user_token;
  }

  async findOne(id: string): Promise<UserToken> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByRefreshToken(refresh_token: string): Promise<UserToken> {
    return await this.repository.findOne({ where: { refresh_token } });
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
