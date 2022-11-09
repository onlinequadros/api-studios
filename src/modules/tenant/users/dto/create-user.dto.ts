import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsPhoneNumber,
  IsString,
  MinLength,
  IsIn,
  IsNotEmpty,
  Length,
  IsOptional,
  IsArray,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Nome do usuário' })
  @Expose()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Sobrenome do usuário' })
  @Expose()
  readonly lastname: string;

  @IsString()
  @IsNotEmpty()
  @Length(11, 11)
  @ApiProperty({ default: '12345678910' })
  @Expose()
  readonly cpf: string;

  @IsEmail()
  @ApiProperty({ default: 'email@fasters.com.br' })
  @Expose()
  readonly email: string;

  @IsPhoneNumber('BR')
  @ApiProperty({ default: '11999999999' })
  @Expose()
  readonly phone: string;

  @IsString()
  @IsIn(['Masculino', 'Feminino'])
  @ApiProperty({ default: 'Masculino' })
  @Expose()
  readonly sex: 'Masculino' | 'Feminino';

  @IsDateString()
  @ApiProperty({ default: '1990-01-01' })
  @Expose()
  readonly birth_date: string;

  @IsString()
  @IsIn(['client', 'system'])
  @ApiProperty({ default: 'client' })
  @Expose()
  readonly user_type: 'client' | 'system';

  @IsString()
  @MinLength(6)
  @ApiProperty({ default: '123456' })
  @Expose()
  readonly password: string;

  @IsOptional()
  @Expose()
  readonly avatar?: string;

  @IsOptional()
  @Expose()
  readonly forgot_password?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['Admin', 'Studio', 'Fotografo', 'Artista', 'Client'])
  @ApiProperty({ default: 'Nível de acesso e permissão' })
  @Expose()
  readonly role: 'Admin' | 'Studio' | 'Fotografo' | 'Artista' | 'Client';

  @IsOptional()
  @IsArray()
  @ApiProperty()
  @Expose()
  readonly permissions: string[];

  @Expose()
  readonly is_active?: boolean;
}
