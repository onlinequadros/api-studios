import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserDinamicRepository } from './repositories/users.repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MailsStudioModule } from '../mails/mail-studio.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), MailsStudioModule],
  controllers: [UserController],
  providers: [UserService, UserDinamicRepository],
  exports: [UserService],
})
export class UserModule {}
