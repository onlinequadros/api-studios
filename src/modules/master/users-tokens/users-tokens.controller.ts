import { Controller } from '@nestjs/common';
import { UsersTokensService } from './users-tokens.service';

@Controller('users-tokens')
export class UsersTokensController {
  constructor(private readonly usersTokensService: UsersTokensService) {}
}
