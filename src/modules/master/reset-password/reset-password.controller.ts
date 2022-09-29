import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetPasswordService } from './reset-password.service';

@ApiTags('Passwords')
@Controller('reset-password')
export class ResetPasswordController {
  constructor(private readonly resetPasswordService: ResetPasswordService) {}

  @ApiUnauthorizedResponse({ description: 'Token invalido' })
  @Post()
  @ApiOperation({ summary: 'Cadastro de uma nova senha.' })
  async resetPassword(
    @Body(new ValidationPipe()) resetPasswordDto: ResetPasswordDto,
  ) {
    return await this.resetPasswordService.reset({
      token: resetPasswordDto.token,
      password: resetPasswordDto.password,
    });
  }
}
