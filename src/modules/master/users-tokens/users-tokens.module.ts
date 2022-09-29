import { Module } from '@nestjs/common';
import { UsersTokensService } from './users-tokens.service';
import { UsersTokensController } from './users-tokens.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserToken } from './entities/user-token.entity';
import { UsersTokensRepository } from './repositories/users-tokens.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserToken])],
  controllers: [UsersTokensController],
  providers: [UsersTokensService, UsersTokensRepository],
  exports: [UsersTokensRepository],
})
export class UsersTokensModule {}
