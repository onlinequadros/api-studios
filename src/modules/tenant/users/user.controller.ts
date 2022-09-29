import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, ReadUserDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IResponseUserData } from './interface/read-user-pagination';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('search') search: string,
  ): Promise<IResponseUserData> {
    return this.userService.findAll({
      limit,
      page,
      search,
    });
  }

  @Get('/system')
  @UseGuards(JwtAuthGuard)
  async findAllSystem(): Promise<ReadUserDto[]> {
    return this.userService.findAllSystem();
  }

  @Get(':user_id')
  // @UseGuards(JwtAuthGuard)
  async findOne(@Param('user_id') user_id: string): Promise<ReadUserDto> {
    return this.userService.findOneUser(user_id);
  }

  @Delete(':user_id')
  // @UseGuards(JwtAuthGuard)
  async DeleteUser(@Param('user_id') user_id: string): Promise<boolean> {
    return this.userService.deleteUser(user_id);
  }

  @Post()
  async create(@Body() client: CreateUserDto): Promise<ReadUserDto> {
    return this.userService.create(client);
  }
}
