import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, ReadUserDto, UpdateUserDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IResponseUserData } from './interface/read-user-pagination';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  // @UseGuards(JwtAuthGuard)
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
  // @UseGuards(JwtAuthGuard)
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

  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file,
    @Query('id') id: string,
  ): Promise<{ url: string }> {
    return await this.userService.uploadAvatar(file, id);
  }

  @Put('update-profile/:id')
  async UpdateProfile(
    @Param('id') id: string,
    @Body() profile: UpdateUserDto,
  ): Promise<ReadUserDto> {
    return this.userService.updateProfile(id, profile);
  }

  @Patch('update-profile-pass/:id')
  async UpdateProfilePassword(
    @Param('id') id: string,
    @Body()
    {
      passwordInfoOld,
      passwordInfoNew,
    }: { passwordInfoOld: string; passwordInfoNew: string },
  ): Promise<ReadUserDto> {
    return this.userService.updateProfilePassword(
      id,
      passwordInfoOld,
      passwordInfoNew,
    );
  }
}
