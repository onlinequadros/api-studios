import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsPhoneNumber,
  IsString,
  IsIn,
  IsNotEmpty,
  Length,
  IsBoolean,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class ReadClientDto {
  @IsNumber()
  @Expose()
  readonly id: number;

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

  @IsOptional()
  @ApiProperty({ default: '99999999999999' })
  @Expose()
  readonly cnpj?: string;

  @IsOptional()
  @ApiProperty({ default: 'Nome da empresa ou fantasia' })
  @Expose()
  readonly company_name?: string;

  @IsOptional()
  @ApiProperty({ default: 'Mensagem para direcionamento ou envio de e-mail' })
  message_email?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Nome do endereço' })
  @Expose()
  readonly address: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Número do endereço' })
  @Expose()
  readonly number: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Bairro' })
  @Expose()
  readonly district: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Cidade' })
  @Expose()
  readonly city: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Estado' })
  @Expose()
  readonly uf: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'CEP do endereço' })
  @Expose()
  readonly cep: string;

  @IsOptional()
  @ApiProperty({ default: 'Complemento' })
  @Expose()
  readonly complement?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Segmento' })
  @Expose()
  readonly segment: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'nome company tenant' })
  @Expose()
  readonly tenant_company: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['Admin', 'Studio', 'Fotografo', 'Artista'])
  @ApiProperty({ default: 'Nível de acesso e permissão' })
  @Expose()
  readonly role: 'Admin' | 'Studio' | 'Fotografo' | 'Artista';

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ default: 'true' })
  @Expose()
  readonly login_notification: boolean;

  @Expose()
  readonly validate_access?: boolean;

  @Expose()
  readonly code_access?: string;

  @Expose()
  readonly status?: string;

  @Expose()
  readonly plan_recurrence?: string;

  @Expose()
  readonly plan_id?: string;

  @Expose()
  readonly is_active?: string;

  @Expose()
  readonly deleted_at?: Date;
}
